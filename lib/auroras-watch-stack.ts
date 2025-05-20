import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class AurorasWatchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a DynamoDB table for storing user email addresses
    const emailTable = new dynamodb.Table(this, 'EmailTable', {
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
    });

    const emailLambda = new NodejsFunction(this, "emaillambda", {
      environment: {
        EMAIL_TABLE_NAME: emailTable.tableName,
      },
      timeout: cdk.Duration.minutes(15),
    });

    // Allow emailLambda to call ssm:GetParameter on the icloud_smtp_pass parameter
    emailLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ssm:GetParameter'],
      resources: ['arn:aws:ssm:*:*:parameter/icloud_smtp_pass'],
    }));


    // Grant emailLambda permissions to read from the DynamoDB table
    emailTable.grantReadData(emailLambda);

    // Create a Lambda function for subscribing and unsubscribing users
    const subscriptionLambda = new NodejsFunction(this, "subscriptionLambda", {
      environment: {
        EMAIL_TABLE_NAME: emailTable.tableName,
      },
      timeout: cdk.Duration.minutes(5),
    });

    // Grant subscriptionLambda permissions to read and write to the DynamoDB table
    emailTable.grantReadWriteData(subscriptionLambda);

    // Create an API Gateway
    const api = new apigateway.RestApi(this, 'EmailSubscriptionApi', {
      restApiName: 'Email Subscription Service',
      description: 'This service allows users to subscribe and unsubscribe from email deliveries.',
    });

    const subscribe = api.root.addResource('subscribe');
    subscribe.addMethod('GET', new apigateway.LambdaIntegration(subscriptionLambda));

    const unsubscribe = api.root.addResource('unsubscribe');
    unsubscribe.addMethod('GET', new apigateway.LambdaIntegration(subscriptionLambda));

    const confirmSubscription = api.root.addResource('confirm');
    confirmSubscription.addMethod('GET', new apigateway.LambdaIntegration(subscriptionLambda));
  }
}

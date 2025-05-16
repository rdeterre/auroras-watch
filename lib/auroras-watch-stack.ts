import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from 'aws-cdk-lib/aws-iam';

export class AurorasWatchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const emailLambda = new NodejsFunction(this, "emaillambda", {
      environment: {},
      timeout: cdk.Duration.minutes(15),
    });

    // Allow emailLambda to call ssm:GetParameter on the icloud_smtp_pass parameter
    emailLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ssm:GetParameter'],
      resources: ['arn:aws:ssm:*:*:parameter/icloud_smtp_pass'],
    }));
  }
}

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class AurorasWatchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const emailLambda = new NodejsFunction(this, "emaillambda", {
      environment: {
      },
      timeout: cdk.Duration.minutes(15),
    });

  }
}

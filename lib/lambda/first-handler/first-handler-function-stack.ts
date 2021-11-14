import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { getAppEnv } from '../../config';
import * as iam from '@aws-cdk/aws-iam';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { CommonProps } from '../../common/common-props.interface';

export class FirstHandlerFunctionStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: CommonProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();
    const lambdaTag = process.env.TAG;

    if (!lambdaTag) {
      throw new Error('Must be supply lambda TAG variable to deploy function.');
    }

    if (props?.apiGatewayRestApi) {
      const apigw = props.apiGatewayRestApi;
      const lambdaRole = new iam.Role(this, 'FunctionRole', {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        roleName: `${appEnv}-first-handler-function-role`,
      });
  
      lambdaRole.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        resources: ["*"],
      }));
  
      const functionArtifactsBucket = s3.Bucket.fromBucketAttributes(this, 'FunctionArtifactsBucket', {
        bucketArn: cdk.Fn.importValue(`FunctionArtifactsBucketArn`),
        bucketName: cdk.Fn.importValue(`FunctionArtifactsBucketName`),
      });
      
      const lambdaFn = new lambda.Function(this, 'FirstHandlerFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromBucket(functionArtifactsBucket, `first-handler-function/${lambdaTag}`),
        handler: 'index.handler',
        functionName: `${appEnv}-first-handler-function`,
        role: lambdaRole,
        currentVersionOptions: {
          removalPolicy: cdk.RemovalPolicy.RETAIN,
        },
        description: `deployed at ${new Date()}`
      });
  
      const lambdaVersion = new lambda.Alias(this, 'LambdaAlias', {
        aliasName: 'sample-alias',
        version: lambdaFn.currentVersion,
      });
      (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnVersion).cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;
      (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnVersion).cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.RETAIN;
  
      (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnAlias).cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;
      (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnAlias).cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.RETAIN;

      const apiResource = apigw.root.addResource('first');
      apiResource.addMethod('GET', new apigateway.LambdaIntegration(lambdaFn, { proxy: true }));
  
      new cdk.CfnOutput(this, 'FirstHandlerFunctionArn', {
        value: lambdaFn.functionArn,
        exportName: `FirstHandlerFunctionArn-${appEnv}`,
        description: 'First handler function ARN',
      });
  
      new cdk.CfnOutput(this, 'FirstHandlerFunctionName', {
        value: lambdaFn.functionName,
        exportName: `FirstHandlerFunctionName-${appEnv}`,
        description: 'First handler function Name',
      });
      
  
    }  
  
  }

}

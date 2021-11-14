import * as cdk from '@aws-cdk/core';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import { getAppEnv } from '../config';

export class ApiGateway extends cdk.Stack {

  apiGateway: apiGateway.RestApi;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();

    this.apiGateway = new apiGateway.RestApi(this, 'ApiGw', {
      restApiName: `${appEnv}-apigw`,
      description: 'my awesome api gateway',
      deployOptions: {
        stageName: appEnv,
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.apiGateway.url,
      exportName: `ApiUrl`,
      description: 'Rest API URL',
    });

    new cdk.CfnOutput(this, 'ApiId', {
      value: this.apiGateway.restApiId,
      exportName: `ApiUrl`,
      description: 'Rest API ID',
    });

    new cdk.CfnOutput(this, 'ApiRootSourceId', {
      value: this.apiGateway.restApiRootResourceId,
      exportName: `ApiRootSourceId`,
      description: 'Rest API root source ID',
    });

  }
}

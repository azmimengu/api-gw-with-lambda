import * as cdk from '@aws-cdk/core';
import * as apiGateway from '@aws-cdk/aws-apigateway';

export interface CommonProps extends cdk.StackProps {
  apiGatewayRestApi: apiGateway.RestApi;
}

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  getConfig,
  getAppEnv,
} from '../lib/config';
import {
  FirstHandlerFunctionStack,
  SecondHandlerFunctionStack
} from '../lib/lambda';
import { ApiGateway } from '../lib/api-gateway';

const app = new cdk.App();
const appEnv = getAppEnv();
const conf = getConfig(app, appEnv);

const env = { account: conf.account, region: conf.region };

const apiGatewayStack = new ApiGateway(app, 'ApiGateway', { env });

const deploymentProjectName = process.env.DEPLOYMENT_LAMBDA_PROJECT;

if (deploymentProjectName == 'first-handler') {
  new FirstHandlerFunctionStack(app, `FirstHandlerFunctionStack-${appEnv}`, {
    apiGatewayRestApi: apiGatewayStack.apiGateway,
    env,
  });
} else if (deploymentProjectName == 'second-handler') {
  new SecondHandlerFunctionStack(app, `SecondHandlerFunctionStack-${appEnv}`, {
    apiGatewayRestApi: apiGatewayStack.apiGateway,
    env
  });
}

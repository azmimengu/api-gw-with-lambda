#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  getConfig,
  getAppEnv,
} from '../lib/config';
import {
  FirstHandlerFunctionCodebuildStack,
  SecondHandlerFunctionCodebuildStack
} from '../lib/lambda';

const app = new cdk.App();
const appEnv = getAppEnv();
const conf = getConfig(app, appEnv);

const env = { account: conf.account, region: conf.region };

new FirstHandlerFunctionCodebuildStack(app, 'FirstHandlerFunctionStack', { env });
new SecondHandlerFunctionCodebuildStack(app, 'SecondHandlerFunctionCodebuildStack', { env });

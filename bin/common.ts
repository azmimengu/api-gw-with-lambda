#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  getConfig,
  getAppEnv,
} from '../lib/config';
import {
  FunctionArtifactsBucketStack,
} from '../lib/s3';

const app = new cdk.App();
const appEnv = getAppEnv();
const conf = getConfig(app, appEnv);

const env = { account: conf.account, region: conf.region };

new FunctionArtifactsBucketStack(app, 'FunctionArtifactsBucketStack', { env });

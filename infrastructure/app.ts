#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { getConfig, getEnvironmentConfig, getTags } from './utils/config';
import { CdnStack } from './stacks/cdn-stack';

// Load and validate configuration
const config = getConfig();

// Get standard tags for resources
const tags = getTags(config);

// Get AWS environment configuration for CDK stacks
const env = getEnvironmentConfig(config);

// Create the CDK application
const app = new cdk.App();

// Create a CDN stack for hosting the Ionic web application
new CdnStack(app, `${config.CDK_APP_NAME}-ui-cdn-${config.CDK_ENV}`, {
  stackName: `${config.CDK_APP_NAME}-ui-cdn-${config.CDK_ENV}`,
  description: `UI CDN for ${config.CDK_APP_NAME} - ${config.CDK_ENV}`,
  // Use the environment variables for account and region
  env,
  // Tags for the stack
  tags,
  // Additional properties
  appName: config.CDK_APP_NAME,
  envName: config.CDK_ENV,
  assetPath: config.CDK_ASSET_PATH,
  domainName: config.CDK_DOMAIN_NAME,
  certificateArn: config.CDK_CERTIFICATE_ARN,
  hostedZoneId: config.CDK_HOSTED_ZONE_ID,
  hostedZoneName: config.CDK_HOSTED_ZONE_NAME,
});

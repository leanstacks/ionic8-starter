/**
 * AWS CDK configuration utilities.
 *
 * This module provides functions to load and validate configuration from environment variables,
 * generate standard resource tags, and create AWS environment configurations for CDK stacks.
 *
 * @module utils/config
 */

import 'dotenv/config';
import { z } from 'zod';

/**
 * Zod schema for CDK configuration validation.
 */
const configSchema = z.object({
  CDK_APP_NAME: z.string().default('ionic8-starter'),
  CDK_ENV: z.enum(['dev', 'qa', 'prd'], 'CDK_ENV must be one of: dev, qa, prd'),
  CDK_ACCOUNT: z.string().optional(),
  CDK_REGION: z.string().optional(),
  CDK_OU: z.string().default('unknown'),
  CDK_OWNER: z.string().default('unknown'),
  CDK_ASSET_PATH: z.string().default('../dist'),
  CDK_DOMAIN_NAME: z.string().optional(),
  CDK_CERTIFICATE_ARN: z.string().optional(),
  CDK_HOSTED_ZONE_ID: z.string().optional(),
  CDK_HOSTED_ZONE_NAME: z.string().optional(),
});

/**
 * Type for validated CDK configuration.
 */
export type Config = z.infer<typeof configSchema>;

/**
 * Parse and validate CDK configuration from environment variables.
 * @returns Validated configuration object.
 * @throws {Error} If required configuration is missing or invalid.
 */
export function getConfig(): Config {
  try {
    const config = configSchema.parse(process.env);

    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`CDK configuration validation failed: ${messages}`);
    }
    throw error;
  }
}

/**
 * Get resource tags based on configuration.
 * @param config The validated configuration.
 * @returns Object containing standard resource tags.
 */
export function getTags(config: Config): Record<string, string> {
  return {
    App: config.CDK_APP_NAME,
    Env: config.CDK_ENV,
    OU: config.CDK_OU,
    Owner: config.CDK_OWNER,
  };
}

/**
 * Get AWS environment configuration for CDK stacks.
 * Uses CDK_ACCOUNT and CDK_REGION if provided, otherwise falls back to
 * CDK_DEFAULT_ACCOUNT and CDK_DEFAULT_REGION which are automatically
 * set by the CDK CLI based on the current AWS credentials and profile.
 *
 * @param config The validated configuration.
 * @returns Environment config object with account and region, or undefined if neither are set.
 */
export function getEnvironmentConfig(config: Config): { account: string; region: string } | undefined {
  const account = config.CDK_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
  const region = config.CDK_REGION || process.env.CDK_DEFAULT_REGION;

  if (account && region) {
    return { account, region };
  }

  return undefined;
}

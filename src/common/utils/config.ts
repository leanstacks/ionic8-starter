/**
 * Application configuration utility using Zod schema validation.
 * Validates and exports environment variables as a type-safe config object.
 */

import { z } from 'zod';

/**
 * Zod schema for environment variables validation.
 * All environment variables must be prefixed with VITE_ for Vite compatibility.
 * @see https://vite.dev/guide/env-and-mode
 */
export const configSchema = z.object({
  /** Build configuration */
  VITE_BUILD_DATE: z.iso.date().describe('The date and time when the application was built'),
  VITE_BUILD_TIME: z.iso.time().describe('The time when the application was built'),
  VITE_BUILD_TS: z.iso.datetime().describe('The timestamp when the application was built'),
  VITE_BUILD_COMMIT_SHA: z.string().describe('The Git commit SHA of the build'),
  VITE_BUILD_ENV_CODE: z.string().describe('The environment code for the build (e.g., local, dev, qa, prd)'),
  VITE_BUILD_WORKFLOW_NAME: z.string().describe('The name of the CI/CD workflow that produced the build'),
  VITE_BUILD_WORKFLOW_RUN_NUMBER: z.coerce
    .number()
    .int()
    .nonnegative()
    .describe('The run number of the CI/CD workflow that produced the build'),
  VITE_BUILD_WORKFLOW_RUN_ATTEMPT: z.coerce
    .number()
    .int()
    .nonnegative()
    .describe('The attempt number of the CI/CD workflow run that produced the build'),
  /** API configuration */
  VITE_BASE_URL_API: z.url().describe('Base URL for REST API service'),
  /** Application configuration */
  VITE_TOAST_AUTO_DISMISS_MILLIS: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(5000)
    .describe('Duration in milliseconds before toast notifications auto-dismiss'),
});

/**
 * Type inference for the configuration object
 */
export type Config = z.infer<typeof configSchema>;

/**
 * Parse and validate environment variables
 */
const parseConfig = (): Config => {
  console.debug('Parsing environment variables with Zod schema validation...');
  try {
    // Parse environment variables using Zod schema
    const parsed = configSchema.parse(import.meta.env);

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationIssues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
      console.error(`Environment variable validation failed with the following issues: ${validationIssues}`);
      throw new Error(`Invalid configuration. Details: ${validationIssues}`);
    }
    throw error;
  }
};

/**
 * Validated and type-safe configuration object.
 * This is the main export that should be used throughout the application.
 */
export const config = parseConfig();

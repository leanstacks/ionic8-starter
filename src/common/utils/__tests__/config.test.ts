import { describe, expect, it } from 'vitest';

import { configSchema } from '../config';

describe('config', () => {
  describe('configSchema validation', () => {
    it('should validate environment object with all valid values', () => {
      // ARRANGE
      const validEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(validEnv);

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.VITE_BUILD_COMMIT_SHA).toBe('abc123def456');
        expect(result.data.VITE_BUILD_ENV_CODE).toBe('dev');
        expect(result.data.VITE_BASE_URL_API).toBe('https://api.example.com');
        expect(result.data.VITE_TOAST_AUTO_DISMISS_MILLIS).toBe(5000);
      }
    });

    it('should fail validation when required environment variables are missing', () => {
      // ARRANGE
      const incompleteEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        // Missing other required variables
      };

      // ACT
      const result = configSchema.safeParse(incompleteEnv);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should fail validation when VITE_BUILD_DATE is invalid', () => {
      // ARRANGE
      const invalidEnv = {
        VITE_BUILD_DATE: 'invalid-date',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(invalidEnv);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should fail validation when VITE_BUILD_TIME is invalid', () => {
      // ARRANGE
      const invalidEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: 'invalid-time',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(invalidEnv);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should fail validation when VITE_BUILD_TS is invalid datetime', () => {
      // ARRANGE
      const invalidEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: 'invalid-datetime',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(invalidEnv);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should fail validation when VITE_BASE_URL_API is not a valid URL', () => {
      // ARRANGE
      const invalidEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'not-a-valid-url',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(invalidEnv);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should coerce string numbers to integers', () => {
      // ARRANGE
      const envWithStringNumbers = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: '99',
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: '3',
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: '3000',
      };

      // ACT
      const result = configSchema.safeParse(envWithStringNumbers);

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.VITE_BUILD_WORKFLOW_RUN_NUMBER).toBe('number');
        expect(result.data.VITE_BUILD_WORKFLOW_RUN_NUMBER).toBe(99);
        expect(typeof result.data.VITE_BUILD_WORKFLOW_RUN_ATTEMPT).toBe('number');
        expect(result.data.VITE_BUILD_WORKFLOW_RUN_ATTEMPT).toBe(3);
        expect(typeof result.data.VITE_TOAST_AUTO_DISMISS_MILLIS).toBe('number');
        expect(result.data.VITE_TOAST_AUTO_DISMISS_MILLIS).toBe(3000);
      }
    });

    it('should use default value for VITE_TOAST_AUTO_DISMISS_MILLIS when not provided', () => {
      // ARRANGE
      const envWithoutToastDefault = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        // VITE_TOAST_AUTO_DISMISS_MILLIS is not provided
      };

      // ACT
      const result = configSchema.safeParse(envWithoutToastDefault);

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.VITE_TOAST_AUTO_DISMISS_MILLIS).toBe(5000);
      }
    });

    it('should fail validation when VITE_BUILD_WORKFLOW_RUN_NUMBER is negative', () => {
      // ARRANGE
      const invalidEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: -1,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(invalidEnv);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should fail validation when VITE_BUILD_WORKFLOW_RUN_ATTEMPT is negative', () => {
      // ARRANGE
      const invalidEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: -5,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(invalidEnv);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should fail validation when VITE_TOAST_AUTO_DISMISS_MILLIS is negative', () => {
      // ARRANGE
      const invalidEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: -1000,
      };

      // ACT
      const result = configSchema.safeParse(invalidEnv);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should validate all required properties are present in parsed config', () => {
      // ARRANGE
      const validEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(validEnv);

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty('VITE_BUILD_DATE');
        expect(result.data).toHaveProperty('VITE_BUILD_TIME');
        expect(result.data).toHaveProperty('VITE_BUILD_TS');
        expect(result.data).toHaveProperty('VITE_BUILD_COMMIT_SHA');
        expect(result.data).toHaveProperty('VITE_BUILD_ENV_CODE');
        expect(result.data).toHaveProperty('VITE_BUILD_WORKFLOW_NAME');
        expect(result.data).toHaveProperty('VITE_BUILD_WORKFLOW_RUN_NUMBER');
        expect(result.data).toHaveProperty('VITE_BUILD_WORKFLOW_RUN_ATTEMPT');
        expect(result.data).toHaveProperty('VITE_BASE_URL_API');
        expect(result.data).toHaveProperty('VITE_TOAST_AUTO_DISMISS_MILLIS');
      }
    });

    it('should provide validation errors for invalid inputs', () => {
      // ARRANGE
      const invalidEnv = {
        VITE_BUILD_DATE: 'invalid',
        VITE_BUILD_TIME: 'invalid',
        VITE_BUILD_TS: 'invalid',
        VITE_BUILD_COMMIT_SHA: '',
        VITE_BUILD_ENV_CODE: '',
        VITE_BUILD_WORKFLOW_NAME: '',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 'not-a-number',
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 'not-a-number',
        VITE_BASE_URL_API: 'invalid-url',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 'not-a-number',
      };

      // ACT
      const result = configSchema.safeParse(invalidEnv);

      // ASSERT
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('should accept valid ISO 8601 datetime format with timezone', () => {
      // ARRANGE
      const validEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(validEnv);

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.VITE_BUILD_TS).toBe('2026-02-11T14:30:00Z');
      }
    });

    it('should validate workflow run number and attempt are non-negative integers', () => {
      // ARRANGE
      const validEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 0,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 0,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 0,
      };

      // ACT
      const result = configSchema.safeParse(validEnv);

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.VITE_BUILD_WORKFLOW_RUN_NUMBER).toBe(0);
        expect(result.data.VITE_BUILD_WORKFLOW_RUN_ATTEMPT).toBe(0);
        expect(result.data.VITE_TOAST_AUTO_DISMISS_MILLIS).toBe(0);
      }
    });
  });

  describe('Config type', () => {
    it('should have correct type structure', () => {
      // ARRANGE
      const validEnv = {
        VITE_BUILD_DATE: '2026-02-11',
        VITE_BUILD_TIME: '14:30:00',
        VITE_BUILD_TS: '2026-02-11T14:30:00Z',
        VITE_BUILD_COMMIT_SHA: 'abc123def456',
        VITE_BUILD_ENV_CODE: 'dev',
        VITE_BUILD_WORKFLOW_NAME: 'CI/CD Pipeline',
        VITE_BUILD_WORKFLOW_RUN_NUMBER: 42,
        VITE_BUILD_WORKFLOW_RUN_ATTEMPT: 1,
        VITE_BASE_URL_API: 'https://api.example.com',
        VITE_TOAST_AUTO_DISMISS_MILLIS: 5000,
      };

      // ACT
      const result = configSchema.safeParse(validEnv);

      // ASSERT - Verify that the type matches the expected structure
      expect(result.success).toBe(true);
      if (result.success) {
        const config = result.data;
        expect(typeof config.VITE_BUILD_DATE).toBe('string');
        expect(typeof config.VITE_BUILD_TIME).toBe('string');
        expect(typeof config.VITE_BUILD_TS).toBe('string');
        expect(typeof config.VITE_BUILD_COMMIT_SHA).toBe('string');
        expect(typeof config.VITE_BUILD_ENV_CODE).toBe('string');
        expect(typeof config.VITE_BUILD_WORKFLOW_NAME).toBe('string');
        expect(typeof config.VITE_BUILD_WORKFLOW_RUN_NUMBER).toBe('number');
        expect(typeof config.VITE_BUILD_WORKFLOW_RUN_ATTEMPT).toBe('number');
        expect(typeof config.VITE_BASE_URL_API).toBe('string');
        expect(typeof config.VITE_TOAST_AUTO_DISMISS_MILLIS).toBe('number');
      }
    });
  });
});

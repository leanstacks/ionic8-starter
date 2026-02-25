import { getConfig, getEnvironmentConfig, getTags, type Config } from './config';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getConfig', () => {
    it('should return valid configuration when CDK_ENV is set', () => {
      process.env.CDK_ENV = 'dev';
      process.env.CDK_DOMAIN_NAME = 'ionic8-starter.dev.example.com';
      process.env.CDK_CERTIFICATE_ARN = 'arn:aws:acm:us-east-1:123456789012:certificate/test';
      process.env.CDK_HOSTED_ZONE_ID = 'Z1234567890ABCDEFGHI';
      process.env.CDK_HOSTED_ZONE_NAME = 'dev.example.com';

      const config = getConfig();

      expect(config).toBeDefined();
      expect(config.CDK_ENV).toBe('dev');
      expect(config.CDK_APP_NAME).toBe('ionic8-starter');
      expect(config.CDK_ASSET_PATH).toBe('../dist');
    });

    it('should return configuration with optional values', () => {
      process.env.CDK_APP_NAME = 'my-app';
      process.env.CDK_ENV = 'prd';
      process.env.CDK_DOMAIN_NAME = 'my-app.prd.example.com';
      process.env.CDK_CERTIFICATE_ARN = 'arn:aws:acm:us-east-1:123456789012:certificate/my-cert';
      process.env.CDK_HOSTED_ZONE_ID = 'Z0987654321FEDCBAXYZ';
      process.env.CDK_HOSTED_ZONE_NAME = 'prd.example.com';
      process.env.CDK_ACCOUNT = '123456789012';
      process.env.CDK_REGION = 'us-east-1';
      process.env.CDK_OU = 'leanstacks';
      process.env.CDK_OWNER = 'platform-team';
      process.env.CDK_ASSET_PATH = '../custom-dist';

      const config = getConfig();

      expect(config).toEqual({
        CDK_APP_NAME: 'my-app',
        CDK_ENV: 'prd',
        CDK_DOMAIN_NAME: 'my-app.prd.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/my-cert',
        CDK_HOSTED_ZONE_ID: 'Z0987654321FEDCBAXYZ',
        CDK_HOSTED_ZONE_NAME: 'prd.example.com',
        CDK_ASSET_PATH: '../custom-dist',
        CDK_ACCOUNT: '123456789012',
        CDK_REGION: 'us-east-1',
        CDK_OU: 'leanstacks',
        CDK_OWNER: 'platform-team',
      });
    });

    it('should throw error when CDK_ENV is missing', () => {
      delete process.env.CDK_ENV;

      expect(() => getConfig()).toThrow('CDK configuration validation failed');
    });

    it('should throw error when CDK_ENV is invalid', () => {
      process.env.CDK_ENV = 'invalid';

      expect(() => getConfig()).toThrow('CDK configuration validation failed');
    });
  });

  describe('getTags', () => {
    it('should return standard tags', () => {
      const config: Config = {
        CDK_APP_NAME: 'ionic8-starter',
        CDK_ENV: 'dev',
        CDK_DOMAIN_NAME: 'ionic8-starter.dev.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/test',
        CDK_HOSTED_ZONE_ID: 'Z1234567890ABCDEFGHI',
        CDK_HOSTED_ZONE_NAME: 'dev.example.com',
        CDK_ASSET_PATH: '../dist',
        CDK_OU: 'leanstacks',
        CDK_OWNER: 'platform-team',
      };

      const tags = getTags(config);

      expect(tags).toEqual({
        App: 'ionic8-starter',
        Env: 'dev',
        OU: 'leanstacks',
        Owner: 'platform-team',
      });
    });

    it('should use default values for OU and Owner when not provided', () => {
      const config: Config = {
        CDK_APP_NAME: 'ionic8-starter',
        CDK_ENV: 'qa',
        CDK_DOMAIN_NAME: 'ionic8-starter.qa.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/test',
        CDK_HOSTED_ZONE_ID: 'Z1234567890ABCDEFGHI',
        CDK_HOSTED_ZONE_NAME: 'qa.example.com',
        CDK_ASSET_PATH: '../dist',
        CDK_OU: 'unknown',
        CDK_OWNER: 'unknown',
      };

      const tags = getTags(config);

      expect(tags).toEqual({
        App: 'ionic8-starter',
        Env: 'qa',
        OU: 'unknown',
        Owner: 'unknown',
      });
    });

    it('should use custom app name in tags', () => {
      const config: Config = {
        CDK_APP_NAME: 'my-custom-app',
        CDK_ENV: 'dev',
        CDK_DOMAIN_NAME: 'my-custom-app.dev.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/test',
        CDK_HOSTED_ZONE_ID: 'Z1234567890ABCDEFGHI',
        CDK_HOSTED_ZONE_NAME: 'dev.example.com',
        CDK_ASSET_PATH: '../dist',
        CDK_OU: 'leanstacks',
        CDK_OWNER: 'unknown',
      };

      const tags = getTags(config);

      expect(tags).toEqual({
        App: 'my-custom-app',
        Env: 'dev',
        OU: 'leanstacks',
        Owner: 'unknown',
      });
    });
  });

  describe('getEnvironmentConfig', () => {
    it('should return account and region from CDK_ACCOUNT and CDK_REGION', () => {
      process.env.CDK_ACCOUNT = '123456789012';
      process.env.CDK_REGION = 'us-west-2';

      const config: Config = {
        CDK_APP_NAME: 'ionic8-starter',
        CDK_ENV: 'dev',
        CDK_DOMAIN_NAME: 'ionic8-starter.dev.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/test',
        CDK_HOSTED_ZONE_ID: 'Z1234567890ABCDEFGHI',
        CDK_HOSTED_ZONE_NAME: 'dev.example.com',
        CDK_ASSET_PATH: '../dist',
        CDK_OU: 'unknown',
        CDK_OWNER: 'unknown',
        CDK_ACCOUNT: '123456789012',
        CDK_REGION: 'us-west-2',
      };

      const envConfig = getEnvironmentConfig(config);

      expect(envConfig).toEqual({
        account: '123456789012',
        region: 'us-west-2',
      });
    });

    it('should fallback to CDK_DEFAULT_ACCOUNT and CDK_DEFAULT_REGION', () => {
      delete process.env.CDK_ACCOUNT;
      delete process.env.CDK_REGION;
      process.env.CDK_DEFAULT_ACCOUNT = '987654321098';
      process.env.CDK_DEFAULT_REGION = 'eu-west-1';

      const config: Config = {
        CDK_APP_NAME: 'ionic8-starter',
        CDK_ENV: 'dev',
        CDK_DOMAIN_NAME: 'ionic8-starter.dev.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/test',
        CDK_HOSTED_ZONE_ID: 'Z1234567890ABCDEFGHI',
        CDK_HOSTED_ZONE_NAME: 'dev.example.com',
        CDK_ASSET_PATH: '../dist',
        CDK_OU: 'unknown',
        CDK_OWNER: 'unknown',
      };

      const envConfig = getEnvironmentConfig(config);

      expect(envConfig).toEqual({
        account: '987654321098',
        region: 'eu-west-1',
      });
    });

    it('should prefer CDK_ACCOUNT over CDK_DEFAULT_ACCOUNT', () => {
      process.env.CDK_DEFAULT_ACCOUNT = '111111111111';
      process.env.CDK_DEFAULT_REGION = 'us-east-1';

      const config: Config = {
        CDK_APP_NAME: 'ionic8-starter',
        CDK_ENV: 'prd',
        CDK_DOMAIN_NAME: 'ionic8-starter.prd.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/test',
        CDK_HOSTED_ZONE_ID: 'Z1234567890ABCDEFGHI',
        CDK_HOSTED_ZONE_NAME: 'prd.example.com',
        CDK_ASSET_PATH: '../dist',
        CDK_OU: 'unknown',
        CDK_OWNER: 'unknown',
        CDK_ACCOUNT: '999999999999',
        CDK_REGION: 'ap-southeast-2',
      };

      const envConfig = getEnvironmentConfig(config);

      expect(envConfig).toEqual({
        account: '999999999999',
        region: 'ap-southeast-2',
      });
    });

    it('should return undefined when neither account nor region are set', () => {
      delete process.env.CDK_ACCOUNT;
      delete process.env.CDK_REGION;
      delete process.env.CDK_DEFAULT_ACCOUNT;
      delete process.env.CDK_DEFAULT_REGION;

      const config: Config = {
        CDK_APP_NAME: 'ionic8-starter',
        CDK_ENV: 'dev',
        CDK_DOMAIN_NAME: 'ionic8-starter.dev.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/test',
        CDK_HOSTED_ZONE_ID: 'Z1234567890ABCDEFGHI',
        CDK_HOSTED_ZONE_NAME: 'dev.example.com',
        CDK_ASSET_PATH: '../dist',
        CDK_OU: 'unknown',
        CDK_OWNER: 'unknown',
      };

      const envConfig = getEnvironmentConfig(config);

      expect(envConfig).toBeUndefined();
    });

    it('should return undefined when only account is set', () => {
      process.env.CDK_DEFAULT_ACCOUNT = '123456789012';
      delete process.env.CDK_DEFAULT_REGION;

      const config: Config = {
        CDK_APP_NAME: 'ionic8-starter',
        CDK_ENV: 'dev',
        CDK_DOMAIN_NAME: 'ionic8-starter.dev.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/test',
        CDK_HOSTED_ZONE_ID: 'Z1234567890ABCDEFGHI',
        CDK_HOSTED_ZONE_NAME: 'dev.example.com',
        CDK_ASSET_PATH: '../dist',
        CDK_OU: 'unknown',
        CDK_OWNER: 'unknown',
      };

      const envConfig = getEnvironmentConfig(config);

      expect(envConfig).toBeUndefined();
    });

    it('should return undefined when only region is set', () => {
      delete process.env.CDK_DEFAULT_ACCOUNT;
      process.env.CDK_DEFAULT_REGION = 'us-east-1';

      const config: Config = {
        CDK_APP_NAME: 'ionic8-starter',
        CDK_ENV: 'dev',
        CDK_DOMAIN_NAME: 'ionic8-starter.dev.example.com',
        CDK_CERTIFICATE_ARN: 'arn:aws:acm:us-east-1:123456789012:certificate/test',
        CDK_HOSTED_ZONE_ID: 'Z1234567890ABCDEFGHI',
        CDK_HOSTED_ZONE_NAME: 'dev.example.com',
        CDK_ASSET_PATH: '../dist',
        CDK_OU: 'unknown',
        CDK_OWNER: 'unknown',
      };

      const envConfig = getEnvironmentConfig(config);

      expect(envConfig).toBeUndefined();
    });
  });
});

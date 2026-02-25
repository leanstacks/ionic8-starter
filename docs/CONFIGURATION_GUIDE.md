# Configuration Guide

This guide provides comprehensive information about configuring the Ionic Starter application and its AWS CDK infrastructure.

## Application Configuration

The Ionic + React application configuration is managed through environment variables prefixed with `VITE_`. These variables are available at build time and runtime in your Ionic + React components.

### Environment Variables

The following environment variables are available for configuring the application:

| Variable                          | Type   | Description                                          | Default | Required |
| --------------------------------- | ------ | ---------------------------------------------------- | ------- | -------- |
| `VITE_BASE_URL_API`               | string | Base URL for API requests                            | -       | Yes      |
| `VITE_TOAST_AUTO_DISMISS_MILLIS`  | number | Auto-dismiss duration for toast notifications (ms)   | `5000`  | No       |
| `VITE_BUILD_DATE`                 | string | Build date (YYYY-MM-DD format)                       | -       | No       |
| `VITE_BUILD_TIME`                 | string | Build time (HH:MM:SS format)                         | -       | No       |
| `VITE_BUILD_TS`                   | string | Build timestamp (ISO 8601 format)                    | -       | No       |
| `VITE_BUILD_COMMIT_SHA`           | string | Git commit SHA of the build                          | -       | No       |
| `VITE_BUILD_ENV_CODE`             | string | Environment code (e.g., `local`, `dev`, `qa`, `prd`) | -       | No       |
| `VITE_BUILD_WORKFLOW_NAME`        | string | CI/CD workflow name                                  | -       | No       |
| `VITE_BUILD_WORKFLOW_RUNNER`      | string | CI/CD workflow runner (e.g., `GitHub Actions`)       | -       | No       |
| `VITE_BUILD_WORKFLOW_RUN_NUMBER`  | string | CI/CD workflow run number                            | -       | No       |
| `VITE_BUILD_WORKFLOW_RUN_ATTEMPT` | string | CI/CD workflow run attempt number                    | -       | No       |

### Setup

1. **Copy the example configuration file:**

   ```bash
   cp .env.example .env
   ```

2. **Update variables for your environment:**

   ```env
   VITE_BASE_URL_API=https://your-api.example.com
   VITE_TOAST_AUTO_DISMISS_MILLIS=5000
   ```

3. **Build information** (typically set by CI/CD pipeline):
   ```env
   VITE_BUILD_DATE=2026-02-10
   VITE_BUILD_TIME=14:30:00
   VITE_BUILD_TS=2026-02-10T14:30:00Z
   VITE_BUILD_COMMIT_SHA=abc123def456
   VITE_BUILD_ENV_CODE=dev
   VITE_BUILD_WORKFLOW_NAME=Build
   VITE_BUILD_WORKFLOW_RUNNER=GitHub Actions
   VITE_BUILD_WORKFLOW_RUN_NUMBER=42
   VITE_BUILD_WORKFLOW_RUN_ATTEMPT=1
   ```

### Accessing Configuration

Application configuration values are accessed through the `config` utility, which provides type-safe, validated configuration throughout your React components and utilities. The utility validates all environment variables at runtime using Zod schema validation, ensuring type safety and early error detection.

Import the `config` object from the common utilities:

```typescript
import { config } from 'common/utils/config';

// API base URL (type-safe string)
const apiUrl = config.VITE_BASE_URL_API;

// Toast settings (type-safe number)
const toastDuration = config.VITE_TOAST_AUTO_DISMISS_MILLIS;

// Build information (type-safe strings)
const buildDate = config.VITE_BUILD_DATE;
const buildCommit = config.VITE_BUILD_COMMIT_SHA;
const envCode = config.VITE_BUILD_ENV_CODE;
```

**Benefits of using the `config` utility:**

- **Type Safety**: All configuration values are validated against a Zod schema, ensuring correct types
- **Validation**: Environment variables are validated on application startup, catching missing or invalid configuration early
- **IDE Support**: Full TypeScript autocomplete and type checking for configuration values
- **Single Source of Truth**: Configuration is centralized and consistently accessed throughout the application

**Configuration Schema Location:**
The Zod schema that validates all environment variables is defined in [src/common/utils/config.ts](../src/common/utils/config.ts). This file also exports the `Config` type for use in type annotations when needed.

### Local Development

For local development, create a `.env` file in the root directory with local values:

```env
VITE_BASE_URL_API=http://localhost:3000
VITE_TOAST_AUTO_DISMISS_MILLIS=5000
VITE_BUILD_DATE=1970-01-01
VITE_BUILD_TIME=00:00:00
VITE_BUILD_TS=1970-01-01T00:00:00Z
VITE_BUILD_COMMIT_SHA=local
VITE_BUILD_ENV_CODE=local
VITE_BUILD_WORKFLOW_NAME=local
VITE_BUILD_WORKFLOW_RUNNER=local
VITE_BUILD_WORKFLOW_RUN_NUMBER=1
VITE_BUILD_WORKFLOW_RUN_ATTEMPT=1
```

### Unit Testing

For running unit tests, create a `.env.test.local` file in the root directory with values optimized for the test environment. This configuration is used by Vitest when running unit tests.

1. **Copy the example configuration file:**

   ```bash
   cp .env.example .env.test.local
   ```

2. **Update with test-specific values:**

   ```env
   # Provided by Pipeline (Simulated)
   VITE_BUILD_DATE=1970-01-01
   VITE_BUILD_TIME=00:00:00
   VITE_BUILD_TS=1970-01-01T00:00:00Z
   VITE_BUILD_COMMIT_SHA=test
   VITE_BUILD_ENV_CODE=test
   VITE_BUILD_WORKFLOW_NAME=test
   VITE_BUILD_WORKFLOW_RUNNER=local
   VITE_BUILD_WORKFLOW_RUN_NUMBER=1
   VITE_BUILD_WORKFLOW_RUN_ATTEMPT=1

   # API Configuration
   # Use JSONPlaceholder for mock API testing
   VITE_BASE_URL_API=https://jsonplaceholder.typicode.com

   # Toasts Configuration
   # Use shorter duration in tests for faster test execution
   VITE_TOAST_AUTO_DISMISS_MILLIS=1500
   ```

#### Test Configuration Notes

- **API Base URL**: Uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - a free fake REST API for testing. In actual test environments, API calls are typically mocked using MSW (Mock Service Worker).
- **Toast Duration**: Reduced to 1500ms for faster test execution while still allowing time for async operations.
- **Build Information**: All build-related variables are set to static test values, ensuring consistent snapshots and reproducible test results.
- **Environment Code**: Set to `test` to distinguish test runs from development and production.

#### Usage with MSW

The test configuration works seamlessly with [MSW](https://mswjs.io/) (Mock Service Worker), which intercepts HTTP requests in tests. The `VITE_BASE_URL_API` can point to a test server, and MSW handlers will intercept and mock responses:

```typescript
// Example MSW handler in tests
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('https://jsonplaceholder.typicode.com/users', () => {
    return HttpResponse.json([{ id: 1, name: 'Test User' }]);
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Infrastructure Configuration

The infrastructure configuration is managed through environment variables prefixed with `CDK_`. These variables control how AWS resources are provisioned and deployed using the AWS CDK.

### Environment Variables

The following environment variables are available for configuring the infrastructure:

| Variable               | Type   | Description                                                                   | Default                    | Required |
| ---------------------- | ------ | ----------------------------------------------------------------------------- | -------------------------- | -------- |
| `CDK_APP_NAME`         | string | Application name used in resource naming and tagging                          | `ionic8-starter`           | No       |
| `CDK_ENV`              | enum   | Deployment environment: `dev`, `qa`, `prd`                                    | -                          | Yes      |
| `CDK_ACCOUNT`          | string | AWS account ID for deployment                                                 | Auto-detected from AWS CLI | No       |
| `CDK_REGION`           | string | AWS region for deployment (e.g., `us-east-1`)                                 | Auto-detected from AWS CLI | No       |
| `CDK_OU`               | string | Organizational Unit for resource tagging                                      | `unknown`                  | No       |
| `CDK_OWNER`            | string | Owner tag for resource tracking                                               | `unknown`                  | No       |
| `CDK_ASSET_PATH`       | string | Path to application build artifacts (relative to infrastructure directory)    | `../dist`                  | No       |
| `CDK_DOMAIN_NAME`      | string | Custom domain name for the application CDN (e.g., `app.example.com`)          | -                          | No       |
| `CDK_CERTIFICATE_ARN`  | string | ACM certificate ARN for custom domain (must be in `us-east-1` for CloudFront) | -                          | No       |
| `CDK_HOSTED_ZONE_ID`   | string | Route53 hosted zone ID for DNS records                                        | -                          | No       |
| `CDK_HOSTED_ZONE_NAME` | string | Route53 hosted zone name (e.g., `example.com`)                                | -                          | No       |

### Setup

1. **Navigate to the infrastructure directory:**

   ```bash
   cd infrastructure
   ```

2. **Copy the example configuration file:**

   ```bash
   cp .env.example .env
   ```

3. **Update variables for your environment:**
   ```env
   CDK_ENV=dev
   CDK_APP_NAME=ionic8-starter
   CDK_ACCOUNT=123456789012
   CDK_REGION=us-east-1
   CDK_OU=software-engineering
   CDK_OWNER=your-team
   ```

### Usage

Infrastructure configuration is loaded and validated through the `getConfig()` function in `infrastructure/utils/config.ts`:

```typescript
import { getConfig, getTags, getEnvironmentConfig } from './utils/config';

const config = getConfig();
const tags = getTags(config);
const envConfig = getEnvironmentConfig(config);

console.log(`Environment: ${config.CDK_ENV}`);
console.log(`App name: ${config.CDK_APP_NAME}`);
console.log(`Tags:`, tags);
```

### Configuration Files

Infrastructure configuration can be provided through:

1. **Environment variables** - Set directly in your shell or CI/CD pipeline (highest priority)
2. **.env file** - Create a `.env` file in the `infrastructure/` directory for local development
3. **Default values** - Specified in the Zod schema (lowest priority)

### Resource Tagging

All AWS resources created by the CDK are automatically tagged with the following tags:

| Tag     | Description                      | Source         |
| ------- | -------------------------------- | -------------- |
| `App`   | Application name                 | `CDK_APP_NAME` |
| `Env`   | Environment (`dev`, `qa`, `prd`) | `CDK_ENV`      |
| `OU`    | Organizational Unit              | `CDK_OU`       |
| `Owner` | Team or individual responsible   | `CDK_OWNER`    |

These tags are used for cost allocation, resource management, and identifying resources in AWS.

### Example Configurations

#### Development Environment

Create `infrastructure/.env` for development deployment:

```env
###############################################
## Development Environment Configuration
###############################################

CDK_APP_NAME=ionic8-starter
CDK_ENV=dev
CDK_ACCOUNT=123456789012
CDK_REGION=us-east-1

### Resource Tagging ###
CDK_OU=software-engineering
CDK_OWNER=frontend-team

### CDN Configuration ###
CDK_ASSET_PATH=../dist
CDK_DOMAIN_NAME=ionic8-starter.dev.example.com
CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CDK_HOSTED_ZONE_ID=Z1234567890ABC
CDK_HOSTED_ZONE_NAME=dev.example.com
```

#### QA Environment

```env
###############################################
## QA Environment Configuration
###############################################

CDK_APP_NAME=ionic8-starter
CDK_ENV=qa
CDK_ACCOUNT=123456789012
CDK_REGION=us-east-1

CDK_OU=software-engineering
CDK_OWNER=frontend-team

CDK_ASSET_PATH=../dist
CDK_DOMAIN_NAME=ionic8-starter.qa.example.com
CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CDK_HOSTED_ZONE_ID=Z1234567890ABC
CDK_HOSTED_ZONE_NAME=qa.example.com
```

#### Production Environment

```env
###############################################
## Production Environment Configuration
###############################################

CDK_APP_NAME=ionic8-starter
CDK_ENV=prd
CDK_ACCOUNT=123456789012
CDK_REGION=us-east-1

CDK_OU=software-engineering
CDK_OWNER=frontend-team

CDK_ASSET_PATH=../dist
CDK_DOMAIN_NAME=ionic8-starter.example.com
CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CDK_HOSTED_ZONE_ID=Z1234567890ABC
CDK_HOSTED_ZONE_NAME=example.com
```

### AWS Account and Region

The CDK uses the following precedence for account and region:

1. **Explicit CDK variables** (highest priority)
   - `CDK_ACCOUNT` - AWS account ID
   - `CDK_REGION` - AWS region

2. **AWS CDK environment defaults**
   - `CDK_DEFAULT_ACCOUNT` - Auto-detected from AWS credentials
   - `CDK_DEFAULT_REGION` - Auto-detected from AWS profile

3. **AWS CLI configuration**
   - Uses the configured AWS profile and region

If neither explicit CDK variables nor CDK_DEFAULT environment variables are set, the CDK will fail with an error requesting explicit account and region configuration.

### Custom Domain and SSL/TLS

To use a custom domain for your application:

1. **Create an ACM certificate** in `us-east-1` (required for CloudFront):

   ```bash
   aws acm request-certificate \
     --domain-name ionic8-starter.example.com \
     --region us-east-1
   ```

2. **Verify the certificate** in the ACM console

3. **Configure in `.env`:**

   ```env
   CDK_DOMAIN_NAME=ionic8-starter.example.com
   CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/xxxxx
   CDK_HOSTED_ZONE_ID=Z1234567890ABC
   CDK_HOSTED_ZONE_NAME=example.com
   ```

4. **Deploy** the CDK stack

---

## Configuration Validation

Both application and infrastructure configurations are validated at runtime:

- **Application**: Environment variables are available in Vite at build time
- **Infrastructure**: Configuration is validated using Zod schema when `getConfig()` is called

If validation fails, you'll see detailed error messages indicating which variables are missing or invalid.

### Common Validation Errors

```
CDK_ENV must be one of: dev, qa, prd
```

Ensure `CDK_ENV` is set to one of the allowed values.

```
CDK configuration validation failed: CDK_ASSET_PATH: Invalid type. Expected string
```

Ensure all required configuration variables are set as the correct type.

---

## Environment-Specific Recommendations

### Development

- Use auto-detected AWS account and region from AWS CLI
- Deploy to a development AWS account
- Enable detailed logging in your application
- Use minimal resource sizes
- Consider using S3 + CloudFront for cost-effective hosting

### QA

- Use dedicated QA AWS account
- Configure proper domain names for testing
- Use production-like configurations
- Enable monitoring and alerting

### Production

- Use dedicated production AWS account
- Configure custom domains with SSL/TLS certificates
- Use appropriate resource sizes
- Enable comprehensive monitoring, logging, and alerting
- Implement backup and disaster recovery plans
- Consider using CloudFront with WAF for protection

---

## Troubleshooting

### CDK Deployment Fails with "Account/Region" Error

**Problem**: CDK deployment fails with an error about missing account or region.

**Solution**:

1. Set `CDK_ACCOUNT` and `CDK_REGION` explicitly in `.env`
2. Ensure AWS CLI is configured with `aws configure`
3. Verify with: `aws sts get-caller-identity`

### Application Configuration Validation Error

**Problem**: Application fails to start with a configuration validation error message.

**Solution**:

1. Ensure all required variables in `.env` are present (see Environment Variables table above)
2. Ensure variables are prefixed with `VITE_` for Vite compatibility
3. Restart the development server after changing `.env`
4. Verify variables are set: `echo $VITE_BASE_URL_API`
5. The config utility will provide detailed error messages indicating which variables are missing or invalid

**Note**: The application uses the `config` utility from `common/utils/config` which validates all environment variables at startup using Zod schema validation. If any required variables are missing or have invalid values, the application will fail with a clear error message indicating the issue.

### CDK Configuration Validation Errors

**Problem**: CDK fails to load configuration with validation errors.

**Solution**:

1. Check `.env` file syntax (no quotes around values unless necessary)
2. Verify required variables are set
3. Check for typos in variable names
4. Ensure enum values match allowed options

### AWS Credentials Issues

**Problem**: CDK cannot access AWS account.

**Solution**:

1. Configure AWS credentials: `aws configure`
2. Verify access: `aws sts get-caller-identity`
3. Use AWS SSO if available: `aws sso login --profile YOUR_PROFILE`
4. Ensure IAM user/role has CDK permissions

---

## Best Practices

1. **Never commit `.env` files** - Use `.gitignore` to exclude them
2. **Use environment-specific `.env` files** - Keep configurations separate per environment
3. **Document configuration changes** - Update this guide when adding new variables
4. **Validate early** - Run CDK synthesis before deployment: `cdk synth`
5. **Use AWS CDK best practices**:
   - Always tag resources for cost allocation
   - Use stack outputs for important values
   - Implement proper error handling
   - Test in lower environments first
6. **Secure sensitive data**:
   - Use AWS Secrets Manager for secrets
   - Never commit credentials to version control
   - Use IAM roles instead of access keys when possible
7. **Monitor and log**:
   - Enable CloudWatch logging for CDN and application
   - Set up CloudWatch alarms for critical metrics
   - Review logs regularly for issues

<br/>

---

For more information about this project, see the main [README](../README.md) or visit the [documentation](./README.md).

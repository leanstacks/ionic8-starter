# Infrastructure Guide

This guide provides a comprehensive overview of the AWS infrastructure for the Ionic Starter frontend application, including architectural decisions, deployment instructions, and operational considerations.

> **Note:** This infrastructure provisions only frontend/presentation tier components. Resources are used for hosting static React assets via a Content Delivery Network (CDN) for optimal performance and scalability.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Infrastructure Components](#infrastructure-components)
3. [Deployment Process](#deployment-process)
4. [Environment Management](#environment-management)
5. [Security Model](#security-model)
6. [Cost Optimization](#cost-optimization)
7. [Monitoring and Observability](#monitoring-and-observability)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

## Architecture Overview

The Ionic Starter frontend application is deployed on AWS using a modern, globally distributed content delivery architecture designed for performance, scalability, and cost optimization. The infrastructure leverages managed services to minimize operational overhead.

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CloudFront Distribution                       │
│              (Global Edge Locations & Caching Layer)                 │
├──────────────────────────────────────────────────────────────────────┤
│  Route 53 DNS │ Origin Access Control │ SSL/TLS Certificate          │
└───────────────┬──────────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    S3 Bucket (Origin)                                │
│        (Hosts compiled React static assets - index.html, JS, CSS)    │
│              (Automatic invalidation on deployment)                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Global Content Delivery**: CloudFront edge locations for low-latency access worldwide
2. **Cost Optimization**: Pay-as-you-go pricing with automatic caching and compression
3. **Security by Design**: Origin Access Control, SSL/TLS encryption, and security headers
4. **Infrastructure as Code**: All infrastructure defined in AWS CDK with TypeScript
5. **Multi-Environment**: Supports dev, qa, staging, and production environments

## Infrastructure Components

### CDN Stack (`cdn-stack.ts`)

**Purpose**: Deploys the compiled React application to a globally distributed content delivery network.

**Key Resources**:

- **S3 Bucket**: Stores compiled static assets (React build output)
  - Public access blocked with Origin Access Control
  - Encryption enabled with S3-managed keys
  - Automatic object deletion on stack destruction (development) or retain (production)
  - No public website hosting required
- **CloudFront Distribution**: Global content delivery network
  - Multiple edge locations for low-latency access
  - Automatic gzip/brotli compression of assets
  - Configurable cache policies for optimal performance
  - Security headers (HSTS, X-Frame-Options, etc.)
  - HTTP to HTTPS redirect
  - SPA error handling (404/403 errors serve index.html for client-side routing)
- **SSL/TLS Certificate** (Optional): ACM certificate for custom domain
  - HTTPS-only access to your application
  - Automatic renewal and management
- **Route 53 DNS Records** (Optional): Custom domain alias
  - A record (IPv4) pointing to CloudFront distribution
  - AAAA record (IPv6) pointing to CloudFront distribution
  - Automatic failover via CloudFront
- **S3 Deployment**: Automated asset sync and cache invalidation
  - Uploads build artifacts from local directory
  - Invalidates CloudFront cache after each deployment
  - Supports incremental updates

**Configuration**:

```bash
# Application CDN configuration
CDK_ASSET_PATH=../dist                          # Path to React build output
CDK_DOMAIN_NAME=app.example.com                 # Custom domain (optional)
CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:...   # SSL certificate (optional)
CDK_HOSTED_ZONE_ID=Z1234567890ABC               # Route 53 zone ID (optional)
CDK_HOSTED_ZONE_NAME=example.com                # Route 53 zone name (optional)
```

**Deployment Outputs**:

The stack exports the following values for each environment:

- `BucketName`: S3 bucket name storing static assets
- `DistributionId`: CloudFront distribution ID
- `DistributionDomainName`: CloudFront auto-generated domain (e.g., `d123.cloudfront.net`)
- `ApplicationUrl`: Full URL to access the application (custom domain or CloudFront domain)
- `CustomDomainName`: Custom domain if configured

**Cost Considerations**:

- CloudFront: Pay per request and data transferred
- S3: Minimal storage costs (small build artifact footprint)
- Data transfer out: $0.085/GB (varies by region)
- Requests: $0.0075 per 10,000 requests
- Default coverage: PRICE_CLASS_100 (uses cheapest edge locations only)

**Use Cases**:

- Isolated hosting of component documentation
- Team design system reference
- Accessible independent of main application deployment
- Separate analytics and monitoring

## Deployment Process

### Prerequisites

1. **AWS Account Setup**:
   - AWS CLI configured with appropriate credentials
   - CDK bootstrap completed in target account/region
   - Sufficient permissions for S3, CloudFront, Route 53, and ACM services

2. **Domain & SSL (Optional but Recommended)**:
   - Existing Route 53 hosted zone for your domain
   - ACM SSL certificate in the same region as CloudFront (typically `us-east-1`)
   - Certificate must be issued for your custom domain(s)

3. **Local Environment**:
   - Node.js (version specified in `.nvmrc`)
   - AWS CDK CLI installed globally: `npm install -g aws-cdk`
   - Vite build output available at `../dist` (relative to infrastructure/)

### Step-by-Step Deployment

1. **Build the React Application**:

   ```bash
   # From the project root
   npm run build
   ```

   This generates optimized static assets in the `dist` directory.

2. **Configure Infrastructure**:

   ```bash
   cd infrastructure
   cp .env.example .env
   # Edit .env with your environment-specific configuration
   ```

3. **Install Infrastructure Dependencies**:

   ```bash
   npm install
   ```

4. **Verify Configuration**:

   ```bash
   npm run synth
   ```

   This generates CloudFormation templates without deploying. Review the synthesized templates in `cdk.out/`.

5. **Deploy Infrastructure** (with confirmation):

   ```bash
   npm run deploy:all
   ```

   Or deploy specific stacks:

   ```bash
   # Deploy only the application CDN
   npm run deploy -- "*ui-cdn*"

   # Deploy all stacks (without confirmation)
   npm run deploy:all -- --require-approval never
   ```

6. **Verify Deployment**:
   - Check AWS Console for created resources
   - Navigate to CloudFront Distributions
   - Test application URL: `https://<your-domain>` or use the CloudFront domain
   - Verify Route 53 DNS records are created (if using custom domain)
   - Test HTTP to HTTPS redirect works

### Deployment Order & Stack Dependencies

CDK automatically manages dependencies, but understand the logical order:

1. **UI CDN Stack**: Deploys main React application
   - Creates S3 bucket
   - Creates CloudFront distribution
   - Uploads assets and invalidates cache
   - Creates Route 53 records (if domain configured)

## Resource Configuration

### Performance Considerations

- **Asset Size**: Minimize bundle size with code splitting and tree-shaking
- **Cache Optimization**: Configure CloudFront caching policies appropriately for different asset types
- **Origin Access**: Use Origin Access Control (OAC) instead of public buckets for security
- **Global Distribution**: CloudFront caches assets across 210+ edge locations worldwide

## Environment Management

### Environment Variables

All configuration uses environment variables prefixed with `CDK_`:

#### Core Infrastructure Variables

| Variable      | Purpose          | Example            | Required |
| ------------- | ---------------- | ------------------ | -------- |
| `CDK_ACCOUNT` | AWS Account ID   | `123456789012`     | Optional |
| `CDK_REGION`  | AWS Region       | `us-east-1`        | Optional |
| `CDK_ENV`     | Environment name | `dev`, `qa`, `prd` | Yes      |

#### Application CDN Variables

| Variable               | Purpose              | Default          | Required |
| ---------------------- | -------------------- | ---------------- | -------- |
| `CDK_APP_NAME`         | Application name     | `ionic8-starter` | No       |
| `CDK_ASSET_PATH`       | Path to build output | `../dist`        | Yes      |
| `CDK_DOMAIN_NAME`      | Custom domain        | -                | No       |
| `CDK_CERTIFICATE_ARN`  | SSL certificate ARN  | -                | No\*     |
| `CDK_HOSTED_ZONE_ID`   | Route 53 zone ID     | -                | No\*     |
| `CDK_HOSTED_ZONE_NAME` | Route 53 zone name   | -                | No\*     |

**Note:** `CDK_CERTIFICATE_ARN`, `CDK_HOSTED_ZONE_ID`, and `CDK_HOSTED_ZONE_NAME` are required only if using `CDK_DOMAIN_NAME`.

#### Resource Tagging Variables

| Variable    | Purpose             | Default   | Example       |
| ----------- | ------------------- | --------- | ------------- |
| `CDK_OU`    | Organizational unit | `unknown` | `frontend`    |
| `CDK_OWNER` | Resource owner      | `unknown` | `team@co.com` |

### Multi-Environment Strategy

Each environment uses:

- Separate `.env` files (recommended)
- Environment-specific stack names: `${appName}-ui-cdn-${env}`
- Environment-specific asset deployment
- Independent CloudFront cache invalidations

Example deployment:

```bash
# Development
CDK_ENV=dev npm run deploy

# Production (with custom domain)
CDK_ENV=prd CDK_DOMAIN_NAME=app.example.com npm run deploy
```

## Security Model

### Content Delivery Security

1. **HTTPS Only**: HTTP automatically redirects to HTTPS
2. **SSL/TLS**: Industry-standard encryption for data in transit
3. **Origin Access Control**: S3 bucket not publicly accessible; CloudFront acts as intermediary
4. **Security Headers**: Automatic security headers (HSTS, X-Frame-Options, etc.)
5. **DDoS Protection**: CloudFront includes built-in DDoS mitigation

### Asset Security

1. **S3 Encryption**: Server-side encryption enabled for all objects
2. **Public Access Blocked**: S3 bucket has public access blocked via policies
3. **CloudFront Caching**: Cached assets served from edge locations, not origin
4. **Access Logging**: Optional S3 access logging for compliance

### Authentication & Access

1. **IAM Roles**: CDK uses least privilege for deployment
2. **Credential Management**: AWS credentials never stored in code or config files
3. **No Public Bucket Access**: Assets only accessible through CloudFront or validated means

## Cost Optimization

### CloudFront Costs

- **PriceClass 100**: Uses cheapest edge locations only
  - Covers North America, Europe, Asia
  - Excludes expensive locations (Australia, South America)
- **Request Pricing**: $0.0075 per 10,000 requests (varies by location)
- **Data Transfer**: $0.085/GB outbound (varies by region)
- **Caching Strategy**: Longer TTLs reduce origin requests
- **Default Configuration**: Optimal for development/staging workloads

### S3 Costs

- **Storage**: Minimal cost for compiled assets (~1-5 MB typical)
- **Requests**: Minimal if CloudFront caching is effective
- **Auto Cleanup**: Development stacks auto-delete objects on destruction
- **Default Configuration**: ~$0.10-0.50/month storage cost

### Cost Optimization Tips

1. **Cache Optimization**: Set appropriate cache TTLs for different asset types
   - HTML (index.html): Short TTL or no cache for SPA routing
   - JS/CSS: Long TTL with content hash for cache busting
   - Images: Long TTL for static assets
2. **PriceClass Selection**: Use PRICE_CLASS_100 for development/staging
   - Saves ~30% vs all edge locations
   - Use PRICE_CLASS_ALL only for global applications

3. **Compression**: CloudFront automatically gzips/brotli compresses eligible assets
   - Reduces bandwidth by 60-80% for text assets
   - No additional configuration needed

4. **Regional Deployment**: Deploy separate stacks per environment
   - Dev/staging in single region or CloudFront
   - Production with global distribution

### Monthly Cost Estimate

| Component                | Usage       | Cost          |
| ------------------------ | ----------- | ------------- |
| CloudFront Requests      | 1M/month    | $7.50         |
| CloudFront Data Transfer | 10 GB/month | $0.85         |
| S3 Storage               | 20 MB       | $0.50         |
| **Total**                |             | **~$9/month** |

## Monitoring and Observability

### CloudFront Monitoring

CloudFront provides built-in metrics through CloudWatch:

1. **Request Metrics**:
   - Total requests
   - Bytes downloaded/uploaded
   - 4xx and 5xx error rates
   - Cache hit ratio

2. **Performance Metrics**:
   - Origin latency
   - Edge location latency
   - Bandwidth utilization

3. **Custom Alarms**:
   - High error rates (>1%)
   - Cache miss spikes
   - Origin connectivity issues

### S3 Monitoring

1. **Access Logging**: Enable S3 access logs for audit trails
2. **Bucket Metrics**: CloudWatch metrics for request patterns
3. **Replication**: Track cross-region replication status (if enabled)

### Application Monitoring

1. **Client-Side Analytics**:
   - Use Google Analytics, Mixpanel, or similar
   - CloudFront does not log to application
2. **Error Tracking**:
   - Browser error tracking (Sentry, Rollbar, etc.)
   - CloudFront error response monitoring
3. **Performance Monitoring**:
   - Web Vitals tracking
   - Core Web Vitals (CLS, FID, LCP)
   - Custom performance metrics

### Alerting Strategy

Set up alerts for:

- High error rate (>1% 4xx/5xx)
- Increased origin latency (>500ms)
- Cache hit ratio drop (<80%)
- Deployment failures during sync
- SSL certificate expiration (ACM)

## Disaster Recovery

### Backup Strategy

1. **Asset Backup**: Regularly commit built assets to version control
2. **Git Strategy**: Tag releases for rollback capability
3. **Source Control**: Main source code is single source of truth
4. **Build Artifacts**: Rebuild from source when needed

### Recovery Procedures

1. **Rollback to Previous Version**:

   ```bash
   # Checkout previous build artifacts
   git checkout <previous-commit-hash>

   # Rebuild if needed
   npm run build

   # Redeploy
   npm run deploy
   ```

2. **CloudFront Cache Invalidation**:

   ```bash
   # Get distribution ID from deployment output
   aws cloudfront create-invalidation \
     --distribution-id <ID> \
     --paths "/*"
   ```

3. **S3 Bucket Restore**:

   ```bash
   # List object versions
   aws s3api list-object-versions \
     --bucket <bucket-name>

   # Restore specific version
   aws s3api get-object \
     --bucket <bucket-name> \
     --key index.html \
     --version-id <version-id> \
     index.html
   ```

## Troubleshooting

### Common Issues

1. **CloudFront 403/Access Denied**:
   - Verify Origin Access Control is configured
   - Check S3 bucket policy allows CloudFront access
   - Verify certificate ARN is in correct region (us-east-1 for CloudFront)

2. **SPA Routing 404 Errors**:
   - Ensure error responses are configured (403/404 → 200 index.html)
   - Verify CloudFront cache policy allows query strings
   - Check distribution is using correct cache policy

3. **Custom Domain Not Resolving**:
   - Verify Route 53 hosted zone ID is correct
   - Check CNAME record points to CloudFront domain
   - Verify Route 53 hosted zone name matches certificate domain

4. **Assets Not Updating After Deployment**:
   - Check CloudFront cache invalidation completed
   - Clear browser cache or use incognito window
   - Verify new assets uploaded to S3
   - Check CloudFront Origin settings

5. **Deployment Fails During Asset Upload**:
   - Verify S3 bucket exists and is accessible
   - Check AWS credentials have S3 permissions
   - Ensure asset path (CDK_ASSET_PATH) is correct
   - Check disk space for asset upload

### Debugging Commands

```bash
# Check CloudFront distribution status
aws cloudfront get-distribution \
  --id <distribution-id>

# Monitor cache invalidation progress
aws cloudfront get-invalidation \
  --distribution-id <distribution-id> \
  --id <invalidation-id>

# Verify S3 bucket contents
aws s3 ls s3://<bucket-name>/ --recursive

# Check CDK synthesis without deploying
npm run synth

# View CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name <stack-name> \
  --query 'StackEvents[0:10]'

# Test CloudFront distribution directly
curl -I https://<cloudfront-domain>/index.html
```

## Best Practices

### Configuration Management

1. **Environment Separation**: Use `.env.dev`, `.env.qa`, `.env.prd`
2. **Build Output**: Always build (`npm run build`) before deployment
3. **Asset Cleanup**: Use appropriate `removalPolicy` per environment
4. **Version Control**: Keep `.env.example` updated, never commit `.env`
5. **Configuration Validation**: Test configuration in development first

### Development Workflow

1. **Local Development**: Use local Vite dev server, not CloudFront
2. **Build Locally**: Verify `dist/` output before deployment
3. **Staging Verification**: Deploy to staging environment first
4. **Progressive Rollout**: Deploy to production after staging validation
5. **Infrastructure as Code**: Always use CDK, never manual AWS changes

### Security Best Practices

1. **Credential Management**: Use AWS profiles or temporary credentials
2. **Certificate Management**: Use ACM for automatic renewal
3. **Domain Management**: Use Route 53 for DNS (not external providers)
4. **Access Logs**: Enable for compliance and security audits
5. **Regular Updates**: Keep CDK and dependencies updated

### Performance Best Practices

1. **Asset Optimization**: Use Vite to optimize production builds
   - Minification
   - Tree-shaking
   - Code splitting
   - Asset hashing for cache busting

2. **Cache Strategy**: Configure optimal TTL for different assets
   - Dynamic content (HTML): 0 or short TTL
   - Versioned assets (JS/CSS with hash): 1 year TTL
   - Images: 1 month TTL

3. **Compression**: Rely on CloudFront gzip/brotli compression
   - No additional configuration needed
   - Automatic for eligible content types

4. **Monitoring**: Track Core Web Vitals
   - Use Google Chrome UX Report
   - Monitor Largest Contentful Paint (LCP)
   - Track Cumulative Layout Shift (CLS)

### Operational Best Practices

1. **Documentation**: Keep infrastructure changes documented
2. **Change Management**: Review CDK diffs before deployment
3. **Release Management**: Use git tags for release tracking
4. **Cost Monitoring**: Review CloudFront costs monthly
5. **Disaster Recovery**: Test rollback procedures regularly

### Code Organization

1. **Single Responsibility**: Keep CDN stack focused on content delivery
2. **Configuration Externalization**: All values in environment variables
3. **Type Safety**: Leverage TypeScript for CDK code
4. **Testing**: Use CDK assertions to validate stack configuration
5. **Code Reviews**: Review infrastructure changes before merging

## Further Reading

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/api/v2/)
- [Project Documentation](../docs/README.md)

<br/>

---

If you have questions or need help, reach out to your team or check the documentation above.

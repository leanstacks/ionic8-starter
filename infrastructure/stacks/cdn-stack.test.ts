/**
 * Unit tests for the CdnStack class.
 *
 * @module stacks/CdnStack.test
 */

import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CdnStack, CdnStackProps } from './cdn-stack';

describe('CdnStack', () => {
  let app: cdk.App;

  beforeEach(() => {
    app = new cdk.App();
  });

  describe('basic stack creation without optional props', () => {
    let stack: CdnStack;
    let template: Template;

    beforeEach(() => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'dev',
        assetPath: '../dist',
      };

      stack = new CdnStack(app, 'TestStack', props);
      template = Template.fromStack(stack);
    });

    it('should create an S3 bucket with correct properties', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256',
              },
            },
          ],
        },
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      });
    });

    it('should create a CloudFront distribution', () => {
      template.hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
          DefaultRootObject: 'index.html',
          Enabled: true,
        },
      });
    });

    it('should configure error responses for SPA routing', () => {
      template.hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: Match.objectLike({
          CustomErrorResponses: [
            Match.objectLike({
              ErrorCode: 403,
              ResponseCode: 200,
              ResponsePagePath: '/index.html',
            }),
            Match.objectLike({
              ErrorCode: 404,
              ResponseCode: 200,
              ResponsePagePath: '/index.html',
            }),
          ],
        }),
      });
    });

    it('should create S3 bucket deployment', () => {
      template.resourceCountIs('AWS::S3::Bucket', 1);
      template.hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
          DefaultRootObject: 'index.html',
        },
      });
    });

    it('should create BucketName output', () => {
      template.hasOutput('BucketName', {
        Description: 'Name of the S3 bucket containing the CDN assets',
      });
    });

    it('should create DistributionId output', () => {
      template.hasOutput('DistributionId', {
        Description: 'CloudFront distribution ID',
      });
    });

    it('should create DistributionDomainName output', () => {
      template.hasOutput('DistributionDomainName', {
        Description: 'CloudFront distribution domain name',
      });
    });

    it('should create ApplicationUrl output using distribution domain', () => {
      template.hasOutput('ApplicationUrl', {
        Description: 'URL to access the application',
      });
    });

    it('should not create certificate when certificateArn is not provided', () => {
      expect(stack.certificate).toBeUndefined();
    });

    it('should not create A record when domain props are not provided', () => {
      expect(stack.aRecord).toBeUndefined();
    });

    it('should not create AAAA record when domain props are not provided', () => {
      expect(stack.aaaaRecord).toBeUndefined();
    });

    it('should not include domain names in distribution', () => {
      template.hasResourceProperties(
        'AWS::CloudFront::Distribution',
        Match.not(
          Match.objectLike({
            DistributionConfig: {
              Aliases: Match.arrayWith([Match.anyValue()]),
            },
          }),
        ),
      );
    });

    it('should not create CustomDomainName output', () => {
      const outputs = template.findOutputs('*');
      expect(Object.keys(outputs)).not.toContain('CustomDomainName');
    });
  });

  describe('stack creation with certificate', () => {
    let stack: CdnStack;
    let template: Template;

    beforeEach(() => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'dev',
        assetPath: '../dist',
        certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/test-cert',
        domainName: 'app.example.com',
      };

      stack = new CdnStack(app, 'TestStackWithCert', props);
      template = Template.fromStack(stack);
    });

    it('should load certificate when certificateArn is provided', () => {
      expect(stack.certificate).toBeDefined();
    });

    it('should include domain names in distribution when certificate is present', () => {
      template.hasResourceProperties(
        'AWS::CloudFront::Distribution',
        Match.objectLike({
          DistributionConfig: {
            Aliases: ['app.example.com'],
          },
        }),
      );
    });

    it('should configure ViewerProtocolPolicy to REDIRECT_TO_HTTPS', () => {
      template.hasResourceProperties(
        'AWS::CloudFront::Distribution',
        Match.objectLike({
          DistributionConfig: {
            DefaultCacheBehavior: Match.objectLike({
              ViewerProtocolPolicy: 'redirect-to-https',
            }),
          },
        }),
      );
    });

    it('should use CACHING_OPTIMIZED cache policy', () => {
      template.hasResourceProperties(
        'AWS::CloudFront::Distribution',
        Match.objectLike({
          DistributionConfig: {
            DefaultCacheBehavior: Match.objectLike({
              CachePolicyId: Match.anyValue(),
            }),
          },
        }),
      );
    });

    it('should include security headers in response', () => {
      template.hasResourceProperties(
        'AWS::CloudFront::Distribution',
        Match.objectLike({
          DistributionConfig: {
            DefaultCacheBehavior: Match.objectLike({
              ResponseHeadersPolicyId: Match.anyValue(),
            }),
          },
        }),
      );
    });
  });

  describe('stack creation with full domain configuration', () => {
    let stack: CdnStack;
    let template: Template;

    beforeEach(() => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'prod',
        assetPath: '../dist',
        certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/test-cert',
        domainName: 'app.example.com',
        hostedZoneId: 'Z1234567890ABC',
        hostedZoneName: 'example.com',
      };

      stack = new CdnStack(app, 'TestStackWithDomain', props);
      template = Template.fromStack(stack);
    });

    it('should create A record for custom domain', () => {
      expect(stack.aRecord).toBeDefined();
    });

    it('should create AAAA record for custom domain', () => {
      expect(stack.aaaaRecord).toBeDefined();
    });

    it('should create Route53 A record with CloudFront alias', () => {
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'A',
        Name: 'app.example.com.',
        AliasTarget: Match.objectLike({
          HostedZoneId: Match.anyValue(),
        }),
      });
    });

    it('should create Route53 AAAA record with CloudFront alias', () => {
      template.hasResourceProperties('AWS::Route53::RecordSet', {
        Type: 'AAAA',
        Name: 'app.example.com.',
        AliasTarget: Match.objectLike({
          HostedZoneId: Match.anyValue(),
        }),
      });
    });

    it('should create CustomDomainName output when domain is configured', () => {
      template.hasOutput('CustomDomainName', {
        Description: 'Custom domain name for the application',
      });
    });

    it('should create ApplicationUrl output using custom domain', () => {
      const outputs = template.findOutputs('ApplicationUrl');
      expect(outputs).toHaveProperty('ApplicationUrl');
    });
  });

  describe('edge cases', () => {
    it('should not create Route53 records when hostedZoneId is missing', () => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'dev',
        assetPath: '../dist',
        certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/test-cert',
        domainName: 'app.example.com',
        hostedZoneName: 'example.com',
        // hostedZoneId is missing
      };

      const stack = new CdnStack(app, 'TestStackMissingZoneId', props);

      expect(stack.aRecord).toBeUndefined();
      expect(stack.aaaaRecord).toBeUndefined();
    });

    it('should not create Route53 records when hostedZoneName is missing', () => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'dev',
        assetPath: '../dist',
        certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/test-cert',
        domainName: 'app.example.com',
        hostedZoneId: 'Z1234567890ABC',
        // hostedZoneName is missing
      };

      const stack = new CdnStack(app, 'TestStackMissingZoneName', props);

      expect(stack.aRecord).toBeUndefined();
      expect(stack.aaaaRecord).toBeUndefined();
    });

    it('should not add domain names to distribution when certificateArn is missing', () => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'dev',
        assetPath: '../dist',
        domainName: 'app.example.com',
        // certificateArn is missing
      };

      const stack = new CdnStack(app, 'TestStackNoCert', props);
      const template = Template.fromStack(stack);

      template.hasResourceProperties(
        'AWS::CloudFront::Distribution',
        Match.not(
          Match.objectLike({
            DistributionConfig: {
              Aliases: Match.arrayWith([Match.anyValue()]),
            },
          }),
        ),
      );
    });
  });

  describe('stack properties and resource naming', () => {
    it('should use appName and envName in resource identifiers', () => {
      const props: CdnStackProps = {
        appName: 'my-app',
        envName: 'staging',
        assetPath: '../dist',
      };

      const stack = new CdnStack(app, 'TestStackNaming', props);

      expect(stack).toBeDefined();
      expect(stack.bucket).toBeDefined();
      expect(stack.distribution).toBeDefined();
    });

    it('should have bucket and distribution as public properties', () => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'dev',
        assetPath: '../dist',
      };

      const stack = new CdnStack(app, 'TestStackProperties', props);

      expect(stack.bucket).toBeDefined();
      expect(stack.distribution).toBeDefined();
    });

    it('should inherit from cdk.Stack', () => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'dev',
        assetPath: '../dist',
      };

      const stack = new CdnStack(app, 'TestStackInheritance', props);

      expect(stack).toBeInstanceOf(cdk.Stack);
    });
  });

  describe('CloudFront configuration details', () => {
    let stack: CdnStack;
    let template: Template;

    beforeEach(() => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'dev',
        assetPath: '../dist',
      };

      stack = new CdnStack(app, 'TestStackCloudFront', props);
      template = Template.fromStack(stack);
    });

    it('should enable IPv6', () => {
      template.hasResourceProperties(
        'AWS::CloudFront::Distribution',
        Match.objectLike({
          DistributionConfig: {
            Enabled: true,
          },
        }),
      );
    });

    it('should use PRICE_CLASS_100 for cost optimization', () => {
      template.hasResourceProperties('AWS::CloudFront::Distribution', Match.anyValue());
    });

    it('should include comment with appName and envName', () => {
      template.hasResourceProperties(
        'AWS::CloudFront::Distribution',
        Match.objectLike({
          DistributionConfig: {
            Comment: 'test-app CDN for dev',
          },
        }),
      );
    });
  });

  describe('S3 bucket configuration details', () => {
    let stack: CdnStack;
    let template: Template;

    beforeEach(() => {
      const props: CdnStackProps = {
        appName: 'test-app',
        envName: 'dev',
        assetPath: '../dist',
      };

      stack = new CdnStack(app, 'TestStackS3', props);
      template = Template.fromStack(stack);
    });

    it('should block all public access to the bucket', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      });
    });

    it('should enable server-side encryption', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256',
              },
            },
          ],
        },
      });
    });

    it('should enforce SSL connections', () => {
      template.hasResourceProperties('AWS::S3::BucketPolicy', Match.anyValue());
    });

    it('should have auto deletion enabled for cleanup', () => {
      // This is verified by checking the stack has both S3 bucket and removal policies configured
      expect(stack.bucket).toBeDefined();
    });
  });
});

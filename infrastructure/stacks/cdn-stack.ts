/**
 * An AWS CDK stack for deploying a Content Delivery Network (CDN) using CloudFront and S3.
 *
 * @module stacks/CdnStack
 */

import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53_targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

export interface CdnStackProps extends cdk.StackProps {
  /**
   * The name of the application, used for resource naming and tagging
   */
  appName: string;
  /**
   * The deployment environment (e.g. 'dev', 'qa', 'prd')
   */
  envName: string;
  /**
   * The path to the local directory containing the static assets to be deployed to S3 (e.g. '../dist')
   */
  assetPath: string;
  /**
   * Optional custom domain name for the CDN (e.g. 'app.example.com').
   * If not provided, the CloudFront distribution domain will be used.
   */
  domainName?: string;
  /**
   * The ARN of the SSL certificate for the custom domain
   */
  certificateArn?: string;
  /**
   * The ID of the Route53 hosted zone for the custom domain
   */
  hostedZoneId?: string;
  /**
   * The name of the Route53 hosted zone for the custom domain (e.g. 'example.com')
   */
  hostedZoneName?: string;
}

/**
 * A CDK stack that sets up a CloudFront distribution with an S3 origin for hosting a frontend application.
 *
 * Creates:
 * - S3 bucket for hosting static assets
 * - CloudFront distribution for content delivery
 * - Optional SSL certificate and custom domain
 */
export class CdnStack extends cdk.Stack {
  /**
   * The S3 bucket containing the static assets
   */
  public readonly bucket: s3.Bucket;

  /**
   * The CloudFront distribution
   */
  public readonly distribution: cloudfront.Distribution;

  /**
   * The SSL certificate (if configured)
   */
  public readonly certificate?: certificatemanager.ICertificate;

  /**
   * The Route53 A record for the custom domain (if configured)
   */
  public readonly aRecord?: route53.ARecord;

  /**
   * The Route53 AAAA record for the custom domain (if configured)
   */
  public readonly aaaaRecord?: route53.AaaaRecord;

  constructor(scope: Construct, id: string, props: CdnStackProps) {
    super(scope, id, props);

    // Create S3 bucket for the CDN assets
    this.bucket = new s3.Bucket(this, `${props.appName}-cdn-bucket-${props.envName}`, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
    });

    // Handle SSL certificate if configured
    if (props.certificateArn) {
      this.certificate = certificatemanager.Certificate.fromCertificateArn(
        this,
        `${props.appName}-certificate-${props.envName}`,
        props.certificateArn,
      );
    }

    // Configure CloudFront distribution properties
    const baseDistributionProps: cloudfront.DistributionProps = {
      comment: `${props.appName} CDN for ${props.envName}`,
      defaultBehavior: {
        origin: cloudfront_origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
          responseHttpStatus: 200,
        },
        {
          httpStatus: 404,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
          responseHttpStatus: 200,
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enableIpv6: true,
    };

    // Optionally add custom domain and SSL certificate to the distribution
    const distributionProps: cloudfront.DistributionProps =
      props.domainName && this.certificate
        ? {
            ...baseDistributionProps,
            domainNames: [props.domainName],
            certificate: this.certificate,
          }
        : baseDistributionProps;

    // Create the CloudFront distribution
    this.distribution = new cloudfront.Distribution(
      this,
      `${props.appName}-distribution-${props.envName}`,
      distributionProps,
    );

    // Deploy static assets to the S3 bucket and invalidate CloudFront cache
    new s3_deployment.BucketDeployment(this, `${props.appName}-deployment-${props.envName}`, {
      sources: [s3_deployment.Source.asset(props.assetPath)],
      destinationBucket: this.bucket,
      distribution: this.distribution,
      distributionPaths: ['/*'],
      memoryLimit: 512,
    });

    // Optionally create Route53 records for the custom domain
    if (props.domainName && props.hostedZoneId && props.hostedZoneName) {
      const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
        this,
        `${props.appName}-hosted-zone-${props.envName}`,
        {
          hostedZoneId: props.hostedZoneId,
          zoneName: props.hostedZoneName,
        },
      );

      this.aRecord = new route53.ARecord(this, `${props.appName}-a-record-${props.envName}`, {
        zone: hostedZone,
        recordName: props.domainName,
        target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(this.distribution)),
      });

      this.aaaaRecord = new route53.AaaaRecord(this, `${props.appName}-aaaa-record-${props.envName}`, {
        zone: hostedZone,
        recordName: props.domainName,
        target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(this.distribution)),
      });
    }

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'Name of the S3 bucket containing the CDN assets',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront distribution ID',
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront distribution domain name',
    });

    if (this.aRecord) {
      new cdk.CfnOutput(this, 'CustomDomainName', {
        value: this.aRecord.domainName,
        description: 'Custom domain name for the application',
      });
    }

    new cdk.CfnOutput(this, 'ApplicationUrl', {
      value: this.aRecord
        ? `https://${this.aRecord.domainName}`
        : `https://${this.distribution.distributionDomainName}`,
      description: 'URL to access the application',
    });
  }
}

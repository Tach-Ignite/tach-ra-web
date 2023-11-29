import { SSTConfig } from 'sst';
import { NextjsSite, Bucket } from 'sst/constructs';
import * as cdk from 'aws-cdk-lib';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

const fs = require('fs');
const dotenv = require('dotenv');

console.log('start config');

let env: Record<string, string> = {};
if (fs.existsSync(`./.env.dev`)) {
  const ef = fs.readFileSync(`./.env.dev`);
  env = dotenv.parse(ef);
  process.env = { ...process.env, ...env };
  console.log('loaded env file');
}

export default {
  config(_input) {
    return {
      name: process.env.TACH_SST_APP_NAME!,
      region: process.env.TACH_AWS_REGION!,
      stage: process.env.TACH_SST_STAGE!,
      profile: process.env.TACH_AWS_PROFILE!,
    };
  },
  async stacks(app) {
    app.stack(({ stack }) => {
      const serverCachePolicy = new cf.CachePolicy(stack, 'ServerCachePolicy', {
        queryStringBehavior: cf.CacheQueryStringBehavior.all(),
        headerBehavior: cf.CacheHeaderBehavior.none(),
        cookieBehavior: cf.CacheCookieBehavior.none(),
        defaultTtl: cdk.Duration.days(0),
        maxTtl: cdk.Duration.days(365),
        minTtl: cdk.Duration.days(0),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      });

      const certificate = acm.Certificate.fromCertificateArn(
        stack,
        'Certificate',
        process.env.TACH_AWS_CERTIFICATE_ARN!,
      );

      const fileStorageBucket = new Bucket(
        stack,
        process.env.TACH_AWS_BUCKET_NAME!,

        {
          name: process.env.TACH_AWS_BUCKET_NAME!,
          blockPublicACLs: false,
        },
      );

      fileStorageBucket.attachPermissions([
        new iam.PolicyStatement({
          actions: ['s3:GetObject'],
          effect: iam.Effect.ALLOW,
          principals: [new iam.StarPrincipal()],
          resources: [`arn:aws:s3:::${process.env.TACH_AWS_BUCKET_NAME}/*`],
        }),
      ]);

      const domainPrefix =
        process.env.TACH_SST_STAGE === 'prod' ? 'www' : 'dev';

      const site = new NextjsSite(stack, 'site', {
        cdk: {
          serverCachePolicy,
        },
        timeout: '30 seconds',
        memorySize: '2048 MB',
        customDomain: {
          isExternalDomain: false,
          domainName: `${domainPrefix}.${process.env.TACH_SST_DOMAIN_NAME!}`,
          hostedZone: process.env.TACH_SST_DOMAIN_NAME!,
          cdk: {
            certificate,
          },
        },
        environment: {
          ...env,
        },
        bind: [fileStorageBucket],
      });

      site.attachPermissions([
        new iam.PolicyStatement({
          actions: ['ssm:GetParameter'],
          effect: iam.Effect.ALLOW,
          resources: [
            `arn:aws:ssm:${process.env.TACH_AWS_REGION}:${process.env.TACH_AWS_ACCOUNT_ID}:parameter/sst/${process.env.TACH_SST_APP_NAME}/${app.stage}/Secret/*`,
          ],
        }),
      ]);

      site.attachPermissions([
        new iam.PolicyStatement({
          actions: [
            's3:GetObject',
            's3:PutObject',
            's3:DeleteObject',
            's3:ListObjects',
          ],
          effect: iam.Effect.ALLOW,
          resources: [`arn:aws:s3:::${process.env.TACH_AWS_BUCKET_NAME}/*`],
        }),
      ]);

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;

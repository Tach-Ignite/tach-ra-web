import { SSTConfig } from 'sst';
import { NextjsSite, Bucket } from 'sst/constructs';
import * as cdk from 'aws-cdk-lib';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import { GithubActionsStack } from './infra/sst/stacks/githubActionsStack';

const fs = require('fs');
const dotenv = require('dotenv');

console.log('start config');
let env: Record<string, string> = {};
if (fs.existsSync(`./.env.dev`)) {
  const ef = fs.readFileSync(`./.env.dev`);
  env = dotenv.parse(ef);
  process.env = { ...process.env, ...env };
}
console.log('loaded env file');

export default {
  config(_input) {
    return {
      name: process.env.TACH_SST_APP_NAME!,
      region: process.env.TACH_AWS_REGION!,
      stage: 'dev',
      profile: process.env.TACH_AWS_PROFILE!,
    };
  },
  async stacks(app) {
    if (fs.existsSync(`./.env.secrets.local`)) {
      const sf = fs.readFileSync(`./.env.secrets.local`);
      process.env.secrets = JSON.stringify(dotenv.parse(sf));
    }

    app.stack(({ stack }) => {
      GithubActionsStack(
        { app, stack },
        env.TACH_GITHUB_REPO_OWNER!,
        env.TACH_GITHUB_REPO_NAME!,
      );

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

      // const certificate = new acm.Certificate(stack, 'Certificate', {
      //   domainName: '*.example.com',
      //   subjectAlternativeNames: ['example.com'],
      //   certificateName: 'example',
      //   validation: acm.CertificateValidation.fromDns(),
      // });

      const fileStorageBucket = new Bucket(
        stack,
        process.env.TACH_AWS_BUCKET_NAME!,
        {
          name: process.env.TACH_AWS_BUCKET_NAME!,
        },
      );

      const site = new NextjsSite(stack, 'site', {
        cdk: {
          serverCachePolicy,
        },
        timeout: '30 seconds',
        memorySize: '2048 MB',
        // customDomain: {
        //   isExternalDomain: false,
        //   domainName: 'example.com',
        //   cdk: {
        //     certificate,
        //   },
        // },
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

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;

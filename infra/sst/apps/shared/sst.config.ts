import { SSTConfig } from 'sst';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { GithubActionsStack } from '../../stacks/githubActionsStack';

const fs = require('fs');
const dotenv = require('dotenv');

console.log('start config');
let env: Record<string, string> = {};
if (fs.existsSync(`../../../.././.env.prod`)) {
  const ef = fs.readFileSync(`../../../.././.env.prod`);
  env = dotenv.parse(ef);
  process.env = { ...process.env, ...env };
}
console.log('loaded env file');

export default {
  config(_input) {
    return {
      name: `${process.env.TACH_SST_APP_NAME!}-shared`,
      region: process.env.TACH_AWS_REGION!,
      stage: 'prod',
      profile: process.env.TACH_AWS_PROFILE!,
    };
  },
  async stacks(app) {
    app.stack(({ stack }) => {
      const certificate = new acm.Certificate(stack, 'Certificate', {
        domainName: `*.${process.env.TACH_SST_DOMAIN_NAME!}`,
        subjectAlternativeNames: [process.env.TACH_SST_DOMAIN_NAME!],
        certificateName: `${process.env.TACH_SST_APP_NAME!}-${process.env
          .TACH_SST_DOMAIN_NAME!}-certificate`,
        validation: acm.CertificateValidation.fromDns(),
      });

      stack.addOutputs({
        CertificateArn: certificate.certificateArn,
      });
    });
  },
} satisfies SSTConfig;

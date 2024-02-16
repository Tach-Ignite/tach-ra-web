import { SSTConfig } from 'sst';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { GithubActionsStack } from '../../stacks/githubActionsStack';

const fs = require('fs');
const dotenv = require('dotenv');

console.log('start config');
let env: Record<string, string> = {};
if (fs.existsSync(`../../../.././.env.local`)) {
  const ef = fs.readFileSync(`../../../.././.env.local`);
  env = dotenv.parse(ef);
  process.env = { ...process.env, ...env };
} else {
  throw new Error(
    'No .env.local file found. This is required for initial setup of Github Actions CI/CD.',
  );
}
console.log('loaded env file');

export default {
  config(_input) {
    return {
      name: `${process.env.TACH_SST_APP_NAME!}-githubOpenIdConnect`,
      region: process.env.TACH_AWS_REGION!,
      stage: 'prod',
      profile: process.env.TACH_AWS_PROFILE!,
    };
  },
  async stacks(app) {
    app.stack(({ stack }) => {
      GithubActionsStack(
        { app, stack },
        env.TACH_GITHUB_REPO_OWNER!,
        env.TACH_GITHUB_REPO_NAME!,
      );
    });
  },
} satisfies SSTConfig;

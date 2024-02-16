import { exec } from 'child_process';

const { AmplifyClient, UpdateAppCommand } = require('@aws-sdk/client-amplify');
const { SSMClient, PutParameterCommand } = require('@aws-sdk/client-ssm');
const { Octokit } = require('octokit');
const sodium = require('libsodium-wrappers');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

let rawSecrets: { [key: string]: string } = {};
const f = fs.readFileSync(`./.env.secrets.local`);
rawSecrets = dotenv.parse(f);

const _envVars = fs.readFileSync('.env.local', 'utf8').split('\n');
const envVars: { [key: string]: string } = {};

for (let i = 0; i < _envVars.length; i++) {
  const [key, value] = _envVars[i].split('=');
  envVars[key] = value;
}

// Add environment variables as secrets in GitHub
const addVarsAndSecretsToGitHub = async () => {
  const token = rawSecrets.TACH_GITHUB_API_TOKEN;
  const repoName = envVars.TACH_GITHUB_REPO_NAME;
  const owner = envVars.TACH_GITHUB_REPO_OWNER;
  const octokit = new Octokit({ auth: token });
  const publicKeyResponse = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/secrets/public-key',
    {
      owner,
      repo: repoName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  const binkey = sodium.from_base64(
    publicKeyResponse.data.key,
    sodium.base64_variants.ORIGINAL,
  );
  const keyId = publicKeyResponse.data.key_id;
  for (const key of Object.keys(envVars)) {
    if (!key || key.match(/^ *$/) !== null) {
      continue;
    }
    const value = envVars[key];
    console.log(`Adding var for ${key}`);

    try {
      const existingVariable = await octokit.request(
        `GET /repos/{owner}/{repo}/actions/variables/{variable_name}`,
        {
          owner,
          repo: repoName,
          variable_name: key,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );
      console.log(`existing var: ${existingVariable}`);

      await octokit.request(
        `PATCH /repos/{owner}/{repo}/actions/variables/{variable_name}`,
        {
          owner,
          repo: repoName,
          variable_name: key,
          value,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );
    } catch (e) {
      console.log(`error: ${e}`);
      if ((e as any).status === 404) {
        await octokit.request(`POST /repos/{owner}/{repo}/actions/variables`, {
          owner,
          repo: repoName,
          name: key,
          value,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });
      } else {
        throw e;
      }
    }
  }

  for (const key of Object.keys(rawSecrets)) {
    if (!key || key.match(/^ *$/) !== null) {
      continue;
    }
    const value = rawSecrets[key];
    console.log(`Adding secret for ${key}`);
    await sodium.ready;

    const binsec = sodium.from_string(value);

    // Encrypt the secret using libsodium
    const encBytes = sodium.crypto_box_seal(binsec, binkey);

    // Convert the encrypted Uint8Array to Base64
    const output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
    await octokit.request(
      `PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}`,
      {
        owner,
        repo: repoName,
        secret_name: key,
        encrypted_value: output,
        key_id: keyId,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  }
};

const addVarsAndSecretsToEnvsGitHub = async (
  envVars: any,
  rawSecrets: any,
  envName: string,
  associatedBranch: string,
) => {
  const token = rawSecrets.TACH_GITHUB_API_TOKEN;
  const repoName = envVars.TACH_GITHUB_REPO_NAME;
  const repositoryId = envVars.TACH_GITHUB_REPO_ID;
  const owner = envVars.TACH_GITHUB_REPO_OWNER;
  const octokit = new Octokit({ auth: token });
  const publicKeyResponse = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/secrets/public-key',
    {
      owner,
      repo: repoName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  const binkey = sodium.from_base64(
    publicKeyResponse.data.key,
    sodium.base64_variants.ORIGINAL,
  );
  const keyId = publicKeyResponse.data.key_id;

  await octokit.request(
    'PUT /repos/{owner}/{repo}/environments/{environment_name}',
    {
      owner: owner,
      repo: repoName,
      environment_name: envName,
      wait_timer: 30,
      //prevent_self_review: false,
      // reviewers: [
      //   {
      //     type: 'User',
      //     id: 1,
      //   },
      //   {
      //     type: 'Team',
      //     id: 1,
      //   },
      // ],
      deployment_branch_policy: {
        protected_branches: false,
        custom_branch_policies: true,
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  try {
    const branchPolicy = await octokit.request(
      'GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}',
      {
        owner: owner,
        repo: repoName,
        environment_name: envName,
        branch_policy_id: 'BRANCH_POLICY_ID',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    console.log(`existing branch policy: ${branchPolicy}`);

    await octokit.request(
      'PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}',
      {
        owner: owner,
        repo: repoName,
        environment_name: envName,
        branch_policy_id: branchPolicy.id,
        name: 'release/*',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  } catch (e) {
    console.log(`error: ${e}`);
    if ((e as any).status === 404) {
      await octokit.request(
        'POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies',
        {
          owner: owner,
          repo: repoName,
          environment_name: envName,
          name: associatedBranch,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );
    } else {
      throw e;
    }
  }

  for (const key of Object.keys(envVars)) {
    if (!key || key.match(/^ *$/) !== null) {
      continue;
    }
    const value = envVars[key];
    console.log(`Adding var for ${key}`);

    try {
      const existingVariable = await octokit.request(
        `GET /repositories/{repository_id}/environments/{environment_name}/variables/{name}`,
        {
          repository_id: repositoryId,
          environment_name: envName,
          name: key,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );
      console.log(`existing var: ${existingVariable}`);

      await octokit.request(
        `PATCH /repositories/{repository_id}/environments/{environment_name}/variables/{name}`,
        {
          repository_id: repositoryId,
          environment_name: envName,
          name: key,
          value,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );
    } catch (e) {
      console.log(`error: ${e}`);
      if ((e as any).status === 404) {
        await octokit.request(
          `POST /repositories/{repository_id}/environments/{environment_name}/variables`,
          {
            repository_id: repositoryId,
            environment_name: envName,
            name: key,
            value,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          },
        );
      } else {
        throw e;
      }
    }
  }

  for (const key of Object.keys(rawSecrets)) {
    if (!key || key.match(/^ *$/) !== null) {
      continue;
    }
    const value = rawSecrets[key];
    console.log(`Adding secret for ${key}`);
    await sodium.ready;

    const binsec = sodium.from_string(value);

    // Encrypt the secret using libsodium
    const encBytes = sodium.crypto_box_seal(binsec, binkey);

    // Convert the encrypted Uint8Array to Base64
    const output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
    await octokit.request(
      `PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}`,
      {
        repository_id: repositoryId,
        environment_name: envName,
        secret_name: key,
        encrypted_value: output,
        key_id: keyId,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  }
};

async function createGithubEnvFileVariables(
  envVars: any,
  rawSecrets: any,
  env: string,
) {
  // Read the contents of .env.dev
  const envFileContents = fs.readFileSync(
    path.join(__dirname, '.env.local'),
    'utf8',
  );

  const secretName = `TACH_${env.toUpperCase()}_ENV_FILE`;

  console.log(`Adding secret for ${secretName}`);
  await sodium.ready;

  const token = rawSecrets.TACH_GITHUB_API_TOKEN;
  const repoName = envVars.TACH_GITHUB_REPO_NAME;
  const owner = envVars.TACH_GITHUB_REPO_OWNER;
  const octokit = new Octokit({ auth: token });
  const publicKeyResponse = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/secrets/public-key',
    {
      owner,
      repo: repoName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  const binkey = sodium.from_base64(
    publicKeyResponse.data.key,
    sodium.base64_variants.ORIGINAL,
  );
  const keyId = publicKeyResponse.data.key_id;

  let binsec = sodium.from_string(envFileContents);

  // Encrypt the secret using libsodium
  let encBytes = sodium.crypto_box_seal(binsec, binkey);

  // Convert the encrypted Uint8Array to Base64
  let output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
  // await octokit.request(
  //   `PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}`,
  //   {
  //     owner,
  //     repo: repoName,
  //     secret_name: 'TACH_DEV_ENV_FILE',
  //     encrypted_value: output,
  //     key_id: keyId,
  //     headers: {
  //       'X-GitHub-Api-Version': '2022-11-28',
  //     },
  //   },
  // );

  try {
    const existingVariable = await octokit.request(
      `GET /repos/{owner}/{repo}/actions/variables/{variable_name}`,
      {
        owner,
        repo: repoName,
        variable_name: secretName,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    console.log(`existing var: ${existingVariable}`);

    await octokit.request(
      `PATCH /repos/{owner}/{repo}/actions/variables/{variable_name}`,
      {
        owner,
        repo: repoName,
        variable_name: secretName,
        value: envFileContents,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  } catch (e) {
    console.log(`error: ${e}`);
    if ((e as any).status === 404) {
      await octokit.request(`POST /repos/{owner}/{repo}/actions/variables`, {
        owner,
        repo: repoName,
        name: secretName,
        value: envFileContents,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
    } else {
      throw e;
    }
  }
}

// Add environment variables as environment variables in Amplify
const addEnvVarsToAmplify = async (envVars: any, rawSecrets: any) => {
  const appID = envVars.TACH_AWS_AMPLIFY_APP_ID;
  const envName = envVars.TACH_AWS_AMPLIFY_ENVIRONMENT_NAME;
  const amplify = new AmplifyClient({
    region: envVars.TACH_AWS_REGION,
    credentials: {
      accessKeyId: envVars.TACH_AWS_ACCESS_KEY_ID,
      secretAccessKey: rawSecrets.TACH_AWS_SECRET_ACCESS_KEY,
    },
  });
  const input = {
    appId: appID,
    environmentVariables: envVars,
  };
  const command = new UpdateAppCommand(input);
  const response = await amplify.send(command);
  console.log(response);

  const smm = new SSMClient({
    region: envVars.TACH_AWS_REGION,
    credentials: {
      accessKeyId: envVars.TACH_AWS_ACCESS_KEY_ID,
      secretAccessKey: rawSecrets.TACH_AWS_SECRET_ACCESS_KEY,
    },
  });

  for (const key of Object.keys(rawSecrets)) {
    if (!key || key.match(/^ *$/) !== null) {
      continue;
    }
    const value = rawSecrets[key];
    console.log(`Adding secret for ${key}`);
    const name = `/amplify/${appID}/${envName}/${key}`;
    const input = {
      Name: name,
      Value: value,
      Type: 'SecureString',
      Overwrite: true,
    };
    const command = new PutParameterCommand(input);
    const response = await smm.send(command);
    console.log(response);
  }
};

const addSecretsToSSM = async (
  stage: 'prod' | 'dev',
  envVars: any,
  rawSecrets: any,
) => {
  exec(
    `aws sts get-caller-identity --query "Account" --profile  ${envVars.TACH_AWS_PROFILE}`,
    (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      if (
        stdout ===
        'The SSO session associated with this profile has expired or is otherwise invalid. To refresh this SSO session run aws sso login with the corresponding profile.'
      ) {
        console.log(`stdout: ${stdout}`);
        return;
      }
      for (const key of Object.keys(rawSecrets)) {
        if (!key || key.match(/^ *$/) !== null) {
          continue;
        }
        const value = rawSecrets[key];

        exec(
          `npx sst secrets set ${key} "${value}" --stage ${stage}`,
          (error: any, stdout: any, stderr: any) => {
            if (error) {
              console.log(`error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
          },
        );
      }
    },
  );
};

// addVarsAndSecretsToGitHub();
// addEnvVarsToAmplify(envVars, rawSecrets);
// addVarsAndSecretsToEnvsGitHub(envVars, rawSecrets, 'dev', 'dev');
// addSecretsToSSM('dev', envVars, rawSecrets);
// createGithubEnvFileVariables(envVars, rawSecrets, 'dev');

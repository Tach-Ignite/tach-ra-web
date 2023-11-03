import { exec } from 'child_process';

const { AmplifyClient, UpdateAppCommand } = require('@aws-sdk/client-amplify');
const { SSMClient, PutParameterCommand } = require('@aws-sdk/client-ssm');
const { Octokit } = require('octokit');
const sodium = require('libsodium-wrappers');
const fs = require('fs');
const dotenv = require('dotenv');

let rawSecrets: { [key: string]: string } = {};
const f = fs.readFileSync(`./.env.secrets.dev`);
rawSecrets = dotenv.parse(f);

// Read environment variables from .env.local
const _envVars = fs.readFileSync('.env.dev', 'utf8').split('\n');
const envVars: { [key: string]: string } = {};

for (let i = 0; i < _envVars.length; i++) {
  const [key, value] = _envVars[i].split('=');
  envVars[key] = value;
}

// Add environment variables as secrets in GitHub
const addSecretsToGitHub = async () => {
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

// Add environment variables as environment variables in Amplify
const addEnvVarsToAmplify = async () => {
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

const addSecretsToSSM = async () => {
  exec(
    'aws sts get-caller-identity --query "Account" --profile tachignite-dev',
    (error, stdout, stderr) => {
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

        exec(`npx sst secrets set ${key} ${value}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
      }
    },
  );
};

addSecretsToGitHub();
// addEnvVarsToAmplify();
addSecretsToSSM();

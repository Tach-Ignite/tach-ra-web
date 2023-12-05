# Devops

We use a very simple devops strategy, including a local script for deploying environment variables and secrets, and a simple CI/CD flow: the dev branch is pushed to the dev environment, and the main branch is pushed to the production environment.

## Environment variables and secrets

Environment variables are stored in the `.env.dev` file for dev and `.env.prod` for production. Secrets are stored in the `.env.secrets.dev` file for dev and `.env.secrets.prod` for production. The `.env` and `.secrets` files are not tracked by git. These should NOT be stored in your repo.

To deploy the environment variables and secrets in these files, we provide a script `pnpm deploy-env-vars`. This script has a number of capabilities.

### Deploying environment variables and secrets to github enterprise environments

To deploy to github enterprise environments, uncomment the following lines in `./deployEnvVars.ts`:

```typescript
// deployEnvVars.ts

//addVarsAndSecretsToGitHub();
// addEnvVarsToAmplify();
addVarsAndSecretsToEnvsGitHub(devEnvVars, rawDevSecrets, 'dev', 'dev');
addVarsAndSecretsToEnvsGitHub(prodEnvVars, rawProdSecrets, 'prod', 'main');
//addSecretsToSSM('dev');
//addSecretsToSSM('prod');
//createGithubEnvFileVariables();
```

Once these lines are uncommented, run `pnpm deploy-env-vars`. This will set up the env and prod environments in github as well as set the environment variables and secrets within them.

### Deploying environment variables to github (non-enterprise)

We can still manage to deploy environment variables to github, but we need to do it differently. Instead of using environments, we use a single variable file for each environment, then parse that in the workflow. To do this, uncomment the following line in `./deployEnvVars.ts`:

```typescript
// deployEnvVars.ts

//addVarsAndSecretsToGitHub();
// addEnvVarsToAmplify();
//addVarsAndSecretsToEnvsGitHub(devEnvVars, rawDevSecrets, 'dev', 'dev');
//addVarsAndSecretsToEnvsGitHub(prodEnvVars, rawProdSecrets, 'prod', 'main');
//addSecretsToSSM('dev');
//addSecretsToSSM('prod');
createGithubEnvFileVariables();
```

Once these lines are uncommented, run `pnpm deploy-env-vars`. This will create and populate the environment variables in github. **Note: In this scenario, we don't deploy secrets to github. We may explore adding secrets in the future, provided it is proven secure to do so. Logging redaction is a potential concern.**

### Deploying secrets to SSM

To utilize the `ssm` secrets provider, we need to deploy the secrets to SSM. To do this, uncomment the following lines in `./deployEnvVars.ts`:

```typescript
// deployEnvVars.ts

//addVarsAndSecretsToGitHub();
// addEnvVarsToAmplify();
//addVarsAndSecretsToEnvsGitHub(devEnvVars, rawDevSecrets, 'dev', 'dev');
//addVarsAndSecretsToEnvsGitHub(prodEnvVars, rawProdSecrets, 'prod', 'main');
addSecretsToSSM('dev');
addSecretsToSSM('prod');
//createGithubEnvFileVariables();
```

Once these lines are uncommented, run `pnpm deploy-env-vars`. This will release the secrets to SSM.

## Non-enterprise build and deploy

For non-enterprise github, use the `build-non-enterpise-dev.yaml` and `build-non-enterpise-prod.yaml` workflows. These will build and deploy the app to the dev and prod environments respectively.

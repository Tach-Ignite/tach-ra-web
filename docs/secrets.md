# Secrets

Secrets are a particularly tricky problem to obfuscate because they work very differently on different platforms. For example, in Amplify, secrets are managed using Systems Manager (SSM) Parameter Store, then loaded as a single json string into `process.env.secrets``. In Vercel, all environment variables are encrypted and there is no need to handle secrets differently from regular environment variables. For most implementations of secrets management, we must make an async api call to retrieve them. Locally, secrets are loaded from an .env file into a json string at `process.env.secrets`, mimicking the behavior of Amplify.

We've created the necessary secrets provider implementations to handle all of these use cases with a simple configuration change.

## Providers

The desired secrets provider can be configured in the `tach.config.js` in the `secrets.provider` string. The following providers are supported:

- env
- ssm

### Env Provider

The env provider can handle two different scenarios: Either all secrets are stored in a json string under `process.env.secrets` (prioritized) or they are directly stored in `process.env`.

### SSM Provider

This provider pulls all secrets from Systems Manager (SSM) Parameter Store, each as encyrpted `SecretString`s. These parameters should use the following naming convention:

```typescript
`/sst/${process.env.TACH_SST_APP_NAME}/dev/Secret/${key}/value`;
```

All secrets from the `.env.secrets.dev` file can be deployed automatically with this naming convention via `pnpm deploy-env-vars`.

**Note** Due to the nature of the secrets provider requiring access to restricted resources, this provider requires that you either have default credentials configured in your `~/.aws/credentials` file or you have the [proper environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html) configured to access the SSM Parameter store.

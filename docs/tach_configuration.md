# Tach Configuration

The RA features can be toggled and configured using `tach.config.js`. This file is located in the root of the project.

Example:

```javascript
module.exports = {
  storage: {
    data: {
      provider: 'mongodb',
    },
    files: {
      provider: 's3',
    },
    seed: {
      data: ['~/seedData.js', '~/customData.js'],
      files: ['~/seedFiles.js'],
    },
  },
  auth: {
    providers: ['credentials', 'google', 'github', 'azure-ad', 'linkedin'],
  },
  logging: {
    provider: 'winston',
  },
  payment: {
    provider: 'stripe',
  },
  darkMode: {
    default: 'light',
  },
  secrets: {
    provider: 'env',
  },
  notifications: {
    email: {
      provider: 'ses',
    },
  },
};
```

## Local Configuration Override

Often for local development, we would like to avoid relying on external services such as AWS. However, we would like to maintain these services in dev and production. To allow for this, the `tach.config.local.js` file will be loaded if it exists. This file should **not** be checked into source control. This file is automatically created when running `./localInit.sh`.

## Storage Configuration

The storage section contains the configuration for the data and file storage.

### Data Storage

This section configures the data storage provider. The following providers are available:

- mongodb

We are planning on adding more providers in the future.

#### Data Seeder

You can use the seed section to provide a list of data files that will be used to seed the database. The seed files are executed in the order they are provided.

For more information on how to use the seeder, please see the documentation on the [seeder](/docs/seeder.md).

### File storage

This section configures the file storage provider. The following providers are available:

- s3: stores files in AWS S3
- dummy: doesn't store files, but when requesting a signed url, it will return a random image.
- mongodb: stores files in MongoDB using GridFS.

We are planning on adding more providers in the future.

### Logging

This section allows you to configure your chosen router provider.

## Authentication Configuration

This section allows you to define which authentication providers to activate. The following providers are available:

- credentials
- google
- github
- azure-ad
- linkedin

The auth pages will automatically update to reflect the providers that are enabled.

## Payment Configuration

This section allows you to define which payment providers to activate. The following providers are available:

- stripe
- paypal

## Dark Mode Configuration

This optional section allows you to set a dark mode override. This is useful if you want to force a particular theme for your application.

## Secrets Configuration

This section allows you to define which secrets provider to activate. The following providers are available:

- env
- ssm

For more information on how to use the secrets provider, please see the documentation on [secrets](/docs/secrets.md).

## Notifications Configuration

This section allows you configure the provider for notification services. The following providers are available for `email` notifications:

- ses
- console

The `console` provider is ideal for local development; it simple logs the email to the console instead of sending an email.

import fs from 'fs';
import crypto from 'crypto';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { IOptions, ITachConfiguration } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';
import { IConfigurator } from './abstractions/iConfigurator';

@Injectable('configurator', 'tachConfigurationOptions')
export class Configurator implements IConfigurator {
  private readonly _questions = {
    base: [
      {
        type: 'confirm',
        name: 'isLocal',
        message: 'Is this a local development config?',
        default: true,
      },
      {
        type: 'input',
        name: 'envName',
        message:
          'What is the environment name? (e.g. local, dev, staging, prod)',
        default: 'local',
      },
      {
        type: 'input',
        name: 'appId',
        message: 'What is the app id? (e.g. tach-color-store)',
        default: 'tach-color-store',
      },
      {
        type: 'input',
        name: 'appName',
        message: 'What is the app name? (e.g. Tach Color Store)',
        default: 'Tach Color Store',
      },
      {
        type: 'confirm',
        name: 'isPasswordProtected',
        message: 'Should the app be password protected?',
        default: false,
      },
    ],
    'tach-config': [
      {
        type: 'list',
        name: 'dataStorageProvider',
        message: 'Which data storage provider will you use?',
        choices: ['mongodb-atlas-data-api', 'mongodb'],
        default: 'mongodb-atlas-data-api',
      },
      {
        type: 'list',
        name: 'fileStorageProvider',
        message: 'Which file provider will you use?',
        choices: ['s3', 'mongodb'],
        default: 's3',
      },
      {
        type: 'list',
        name: 'seedDataStorageProvider',
        message: 'Which seed data storage provider will you use?',
        choices: ['mongodb'],
        default: 'mongodb',
      },
      {
        type: 'list',
        name: 'seedFileStorageProvider',
        message: 'Which seed file storage provider will you use?',
        choices: ['s3', 'mongodb'],
        default: 's3',
      },
      {
        type: 'checkbox',
        name: 'authProviders',
        message: 'Which auth providers will you use?',
        choices: ['credentials', 'github', 'google', 'linkedin', 'azuread'],
        default: ['credentials', 'github'],
      },
      {
        type: 'list',
        name: 'loggingProvider',
        message: 'Which logging provider will you use?',
        choices: ['winston', 'pino'],
        default: 'winston',
      },
      {
        type: 'list',
        name: 'paymentProvider',
        message: 'Which payment provider will you use?',
        choices: ['stripe', 'paypal'],
        default: 'stripe',
      },
      {
        type: 'list',
        name: 'secretsProvider',
        message: 'Which secrets provider will you use?',
        choices: ['ssm', 'env'],
        default: 'ssm',
      },
      {
        type: 'list',
        name: 'emailProvider',
        message: 'Which email provider will you use?',
        choices: ['ses', 'console'],
        default: 'ses',
      },
      {
        type: 'list',
        name: 'smsProvider',
        message: 'Which sms provider will you use?',
        choices: ['sns', 'twilio', 'console'],
        default: 'sns',
      },
      {
        type: 'list',
        name: 'recaptchaProvider',
        message: 'Which recaptcha provider will you use?',
        choices: ['google', 'console'],
        default: 'google',
      },
    ],
    'password-protection': [
      {
        type: 'input',
        name: 'username',
        message: 'What is the password-protected username?',
      },
      {
        type: 'input',
        name: 'password',
        message: 'What is the password-protected password?',
      },
    ],
    'ssl-cert': [
      {
        type: 'confirm',
        name: 'isSslCertCreated',
        message: 'Has the SSL certificate been created?',
        default: false,
      },
    ],
    'ssl-cert-creation': [
      {
        type: 'input',
        name: 'domainName',
        message: 'What is the domain name? (e.g. example.com)',
        default: 'localhost:3000',
      },
    ],
    'ssl-cert-arn': [
      {
        type: 'input',
        name: 'certArn',
        message: 'What is the SSL certificate ARN?',
      },
    ],
    urls: [
      {
        type: 'confirm',
        name: 'autofill',
        message: 'Would you like to autofill the domain names?',
        default: true,
      },
    ],
    'manual-urls': [
      {
        type: 'input',
        name: 'baseUrl',
        message:
          'What is the base url of your app? (e.g. https://www.example.com)',
      },
      {
        type: 'input',
        name: 'apiUrl',
        message:
          'What is the api url or your app? (e.g. https://www.example.com/api)',
      },
    ],
    'website-tracking': [
      {
        type: 'list',
        name: 'websiteTrackingProvider',
        message: 'Which website tracking provider will you use?',
        choices: ['hotjar'],
        default: 'hotjar',
      },
    ],
    hotjar: [
      {
        type: 'input',
        name: 'hotjarId',
        message: 'What is the Hotjar ID? (e.g. 1234567)',
      },
      {
        type: 'input',
        name: 'hotjarVersion',
        message: 'What is the Hotjar version? (e.g. [6])',
        default: '6',
      },
    ],
    captcha: [
      {
        type: 'list',
        name: 'captchaProvider',
        message: 'What captcha service are you using?',
        choices: ['google', 'fake'],
        default: 'google',
      },
    ],
    'captcha-google': [
      {
        type: 'input',
        name: 'siteKey',
        message: 'What is the Recaptcha site key?',
      },
      {
        type: 'input',
        name: 'secretKey',
        message: 'What is the Recaptcha secret key?',
      },
    ],
    payments: [
      {
        type: 'list',
        name: 'paymentProvider',
        message: 'What payment service are you using?',
        choices: ['stripe', 'paypal'],
        default: 'stripe',
      },
    ],
    stripe: [
      {
        type: 'input',
        name: 'publishableKey',
        message: 'What is the Stripe publishable key?',
      },
      {
        type: 'input',
        name: 'secretKey',
        message: 'What is the Stripe secret key?',
      },
      {
        type: 'input',
        name: 'webhookSecret',
        message: 'What is the Stripe webhook secret?',
      },
    ],
    paypal: [
      {
        type: 'input',
        name: 'paypalSecret',
        message: 'What is the Paypal secret?',
      },
    ],
    aws: [
      {
        type: 'input',
        name: 'region',
        message: 'What is the AWS region?',
        default: 'us-east-1',
      },
      {
        type: 'input',
        name: 'accountId',
        message: 'What is the AWS account ID?',
      },
      {
        type: 'input',
        name: 'profile',
        message:
          'What is the AWS SSO profile? (We recommend using the [default] profile.) If you set this up, you can configure it with the AWS CLI: aws configure sso.',
        default: 'default',
      },
    ],
    'aws-service-account': [
      {
        type: 'input',
        name: 'accessKeyId',
        message: 'What is the AWS access key ID?',
      },
      {
        type: 'input',
        name: 'secretAccessKey',
        message: 'What is the AWS secret access key?',
      },
    ],
    'file-storage': [
      {
        type: 'list',
        name: 'fileStorageProvider',
        message:
          'What file storage provider are you using? (mongodb is for LOCAL DEV ONLY! It does NOT work when deployed to AWS!)',
        choices: ['s3', 'mongodb'],
        default: 's3',
      },
    ],
    s3: [
      {
        type: 'input',
        name: 'bucketName',
        message: 'What is the S3 bucket name?',
      },
    ],
    mongodb: [
      {
        type: 'input',
        name: 'connectionString',
        message: 'What is the MongoDB connection string?',
        default: 'mongodb://localhost:27017',
      },
    ],
    'data-storage': [
      {
        type: 'list',
        name: 'dataStorageProvider',
        message: 'What data storage provider are you using?',
        choices: ['mongodb-atlas-data-api', 'mongodb'],
        default: 'mongodb-atlas-data-api',
      },
    ],
    'mongodb-atlas-data-api': [
      {
        type: 'input',
        name: 'apiUrl',
        message: 'What is the MongoDB Atlas Data API URL?',
      },
      {
        type: 'input',
        name: 'apiKey',
        message: 'What is the MongoDB Atlas Data API key?',
      },
      {
        type: 'input',
        name: 'dataSource',
        message: 'What is the MongoDB Atlas Data API data source?',
      },
      {
        type: 'input',
        name: 'databaseName',
        message: 'What is the MongoDB Atlas Data API database?',
      },
    ],
    email: [
      {
        type: 'input',
        name: 'emailContactAddress',
        message: 'What is the contact inbox email address?',
      },
      {
        type: 'input',
        name: 'emailFromAddress',
        message: 'What is the contact from email address?',
      },
    ],
    sms: [
      {
        type: 'list',
        name: 'provider',
        message: 'Which SMS provider are you using?',
        choices: ['sns', 'twilio', 'console'],
        default: 'sns',
      },
    ],
    sns: [
      {
        type: 'input',
        name: 'sqsQueueUrl',
        message: 'What is SMS SNS Queue URL?',
      },
    ],
    twilio: [
      {
        type: 'input',
        name: 'accountSid',
        message: 'What is the Twilio account SID?',
      },
      {
        type: 'input',
        name: 'originationNumber',
        message: 'What is the Twilio origination number?',
      },
      {
        type: 'input',
        name: 'authToken',
        message: 'What is the Twilio auth token?',
      },
    ],
    'auth-providers': [
      {
        type: 'checkbox',
        name: 'authProviders',
        message: 'Which auth providers will you use?',
        choices: ['credentials', 'google', 'github', 'linkedin', 'azuread'],
        default: ['credentials', 'github'],
      },
    ],
    'google-oauth': [
      {
        type: 'input',
        name: 'clientId',
        message: 'What is the Google OAuth client ID?',
      },
      {
        type: 'input',
        name: 'clientSecret',
        message: 'What is the Google OAuth client secret?',
      },
    ],
    'github-oauth': [
      {
        type: 'input',
        name: 'clientId',
        message: 'What is the Github OAuth client ID?',
      },
      {
        type: 'input',
        name: 'clientSecret',
        message: 'What is the Github OAuth client secret?',
      },
    ],
    'linkedin-oauth': [
      {
        type: 'input',
        name: 'clientId',
        message: 'What is the Linkedin OAuth client ID?',
      },
      {
        type: 'input',
        name: 'clientSecret',
        message: 'What is the Linkedin OAuth client secret?',
      },
    ],
    'azuread-oauth': [
      {
        type: 'input',
        name: 'clientId',
        message: 'What is the Azure AD OAuth client ID?',
      },
      {
        type: 'input',
        name: 'tenantId',
        message: 'What is the Azure AD OAuth tenant ID?',
      },
      {
        type: 'input',
        name: 'clientSecret',
        message: 'What is the Azure AD OAuth client secret?',
      },
    ],
    'github-api': [
      {
        type: 'input',
        name: 'repoOwner',
        message: 'What is the Github repo owner?',
      },
      {
        type: 'input',
        name: 'repoName',
        message: 'What is the Github repo name?',
      },
      {
        type: 'input',
        name: 'apiToken',
        message: 'What is the Github API token?',
      },
    ],
    secrets: [
      {
        type: 'list',
        name: 'secretsProvider',
        message: 'Which secrets provider will you use?',
        choices: ['env', 'ssm'],
        default: 'ssm',
      },
    ],
    logging: [
      {
        type: 'list',
        name: 'loggingProvider',
        message: 'Which logging provider will you use?',
        choices: ['winston', 'pino'],
        default: 'winston',
      },
    ],
  };

  readonly _questionGroups = {
    all: [
      'base',
      'aws',
      'github-api',
      'ssl-cert',
      'urls',
      'website-tracking',
      'captcha',
      'payments',
      'file-storage',
      'data-storage',
      'secrets',
      'email',
      'sms',
      'auth-providers',
      'logging',
    ],
    minimal: ['base', 'ssl-cert-creation', 'urls', 'mongodb'],
    'from-tach-config': [
      'base',
      'ssl-cert',
      'urls',
      'email',
      'website-tracking',
      'services-from-tach-config',
      'github-api',
    ],
  };

  readonly _helpText: Record<string, string> = {
    minimal: `This will configure the absolute minimum needed for local development. Recommended for use with the tach.config.local.js file.`,
    base: `This is the base configuration for the app. It includes the environment name, app id, app name, and whether the app is password protected.`,
    // 'tach-config': `This is the Tach configuration for the app. It includes the data storage provider, file storage provider, seed data storage provider, seed file storage provider, auth providers, logging provider, payment provider, secrets provider, email provider, sms provider, and recaptcha provider.`,
    'password-protection': `This is the password protection configuration for the app. It includes the username and password for password protection.`,
    'ssl-cert': `This is the SSL certificate configuration for the app. It includes whether the SSL certificate has been created and the SSL certificate ARN.`,
    urls: `This configures the app URLs, used by the backend, external services, and NextAuth. If you choose to autofill, the base URL will be autofilled based on the SST domain name and environment name. If you choose not to autofill, you will be prompted to enter the base URL and API URL manually.`,
    // 'ssl-cert-creation': `This is the SSL certificate creation configuration for the app. It includes the domain name.`,
    // 'ssl-cert-arn': `This is the SSL certificate ARN configuration for the app. It includes the SSL certificate ARN and whether to autofill the domain names.`,
    // 'ssl-domains': `This is the SSL domains configuration for the app. It includes the base url and api url of the app.`,
    'website-tracking': `This is the website tracking configuration for the app. It includes the website tracking provider.`,
    // hotjar: `This is the Hotjar configuration for the app. It includes the Hotjar ID and Hotjar version.`,
    captcha: `This is the captcha configuration for the app. It includes the captcha provider.`,
    // 'captcha-google': `This is the Google Recaptcha configuration for the app. It includes the site key and secret key.`,
    payments: `This is the payments configuration for the app. It includes the payment provider.`,
    // stripe: `This is the Stripe configuration for the app. It includes the Stripe publishable key, Stripe secret key, and Stripe webhook secret.`,
    // paypal: `This is the Paypal configuration for the app. It includes the Paypal secret.`,
    aws: `This is the AWS configuration for the app. It includes the AWS region, AWS account ID, service account credentials, and AWS profile.`,
    // 'aws-service-account': `This is the AWS service account configuration for the app. It includes the AWS access key ID and AWS secret access key.`,
    'data-storage': `This is the data storage configuration for the app. It includes the data storage provider.`,
    'file-storage': `This is the file storage configuration for the app. It includes the file storage provider.`,
    secrets: `This is the secrets configuration for the app. It includes the secrets provider.`,
    logging: `This is the logging configuration for the app. It includes the logging provider.`,
    'auth-providers': `This is the auth providers configuration for the app. It includes the auth providers.`,
  };

  private _env: Record<string, string> = {};

  private _secrets: Record<string, string> = {};

  private _tachConfig: ITachConfiguration;

  private _mongoUriAlreadyConfigured: boolean = false;

  private _s3BucketAlreadyConfigured: boolean = false;

  constructor(tachConfigurationOptions: IOptions<ITachConfiguration>) {
    dotenv.config({ path: '.env.local', processEnv: this._env });
    dotenv.config({ path: '.env.secrets.local', processEnv: this._secrets });
    this._tachConfig = tachConfigurationOptions.value;
  }

  async configure(serviceCode: string): Promise<void> {
    console.log(`Configuring ${serviceCode}...`);
    switch (serviceCode) {
      case 'base':
        await this.configureBase();
        break;
      case 'tach-config':
        await this.configureTachConfig();
        break;
      case 'password-protection':
        await this.configurePasswordProtection();
        break;
      case 'aws':
        await this.configureAWS();
        break;
      case 'ssl-cert':
        await this.configureSSLCert();
        break;
      case 'ssl-cert-arn':
        await this.configureSSLCertArn();
        break;
      case 'urls':
        await this.configureUrls();
        break;
      case 'website-tracking':
        await this.configureWebsiteTracking();
        break;
      case 'captcha':
        await this.configureCaptcha();
        break;
      case 'github-api':
        await this.configureGithubAPI();
        break;
      case 'payments':
        await this.configurePayments();
        break;
      case 'file-storage':
        await this.configureFileStorage();
        break;
      case 'data-storage':
        await this.configureDataStorage();
        break;
      case 'email':
        await this.configureEmail();
        break;
      case 'sms':
        await this.configureSMS();
        break;
      case 'auth-providers':
        await this.configureAuthProviders();
        break;
      case 'secrets':
        await this.configureSecrets();
        break;
      case 'logging':
        await this.configureLogging();
        break;
      case 'minimal':
        await this.configureMinimal();
        break;
      case 'mongodb':
        await this.configureMongoDB();
        break;
      case 'ssl-cert-creation':
        await this.configureSSLCertCreation();
        break;
      case 'from-tach-config':
        await this.configureAllFromTachConfig();
        break;
      case 'services-from-tach-config':
        await this.configureFromTachConfig();
        break;
      default:
        console.log(
          `${serviceCode} is not recognized. Use the help command to see available services.`,
        );
        return;
    }

    this.saveEnvAndSecrets();
    this.saveTachConfig();
  }

  async configureAll(): Promise<void> {
    for (let i = 0; i < this._questionGroups.all.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await this.configure(this._questionGroups.all[i]);
    }
    this.saveEnvAndSecrets();
    this.saveTachConfig();
  }

  help(command?: string): void {
    if (command) {
      if (command in this._helpText) {
        console.log(this._helpText[command]);
      } else {
        console.log(
          `\tCommand ${command} is not recognized or has no help text.`,
        );
      }
    } else {
      console.log(`\tThis CLI tool is used to assist in configuring the application along with any service providers used.
      \ttach-cli configure <foo>

\tUsage

\ttach-cli configure                Configure all services within the application
\ttach-cli configure <foo>          Configure <foo> within the application
\ttach-cli help configure           Display this help message
\ttach-cli help configure <foo>     Display help for <command>

\tAvailable Configuration Commands

${Object.keys(this._helpText)
  .map(
    (command) =>
      `\t${command}\t${command.length < 15 ? '\t' : ''}${
        command.length < 8 ? '\t' : ''
      }${this._helpText[command]}`,
  )
  .join('\n')}
`);
    }
  }

  private async configureMinimal() {
    for (let i = 0; i < this._questionGroups.minimal.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await this.configure(this._questionGroups.minimal[i]);
    }
    this.saveEnvAndSecrets();
    this.saveTachConfig();
  }

  private async configureAllFromTachConfig() {
    for (let i = 0; i < this._questionGroups['from-tach-config'].length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await this.configure(this._questionGroups['from-tach-config'][i]);
    }
    this.saveEnvAndSecrets();
    this.saveTachConfig();
  }

  private async configureFromTachConfig() {
    let awsConfigured = false;
    switch (this._tachConfig.storage.data.provider) {
      case 'mongodb-atlas-data-api':
        await this.configureMongoDBAtlasDataAPI();
        break;
      case 'mongodb':
        await this.configureMongoDB();
        break;
      default:
        console.log(
          'Data storage provider not recognized. Please configure it manually.',
        );
    }
    switch (this._tachConfig.storage.files.provider) {
      case 's3':
        await this.configureS3();
        break;
      case 'mongodb':
        await this.configureMongoDB();
        break;
      default:
        console.log(
          'File storage provider not recognized. Please configure it manually.',
        );
    }
    switch (this._tachConfig.storage.seed.data.provider) {
      case 'mongodb':
        await this.configureMongoDB();
        break;
      default:
        console.log(
          'Seed data storage provider not recognized. Please configure it manually.',
        );
    }
    switch (this._tachConfig.storage.seed.files.provider) {
      case 's3':
        await this.configureS3();
        break;
      case 'mongodb':
        await this.configureMongoDB();
        break;
      default:
        console.log(
          'Seed file storage provider not recognized. Please configure it manually.',
        );
    }
    for (let i = 0; i < this._tachConfig.auth.providers.length; i++) {
      switch (this._tachConfig.auth.providers[i]) {
        case 'github':
          // eslint-disable-next-line no-await-in-loop
          await this.configureGithubOAuth();
          break;
        case 'google':
          // eslint-disable-next-line no-await-in-loop
          await this.configureGoogleOAuth();
          break;
        case 'linkedin':
          // eslint-disable-next-line no-await-in-loop
          await this.configureLinkedinOAuth();
          break;
        case 'azuread':
          // eslint-disable-next-line no-await-in-loop
          await this.configureAzureADOAuth();
          break;
        case 'credentials':
          break;
        default:
          console.log(
            'Auth provider not recognized. Please configure it manually.',
          );
      }
    }
    switch (this._tachConfig.payment.provider) {
      case 'stripe':
        await this.configureStripe();
        break;
      case 'paypal':
        await this.configurePaypal();
        break;
      default:
        console.log(
          'Payment provider not recognized. Please configure it manually.',
        );
    }
    switch (this._tachConfig.secrets.provider) {
      case 'ssm':
        if (!awsConfigured) {
          await this.configureAWS();
          awsConfigured = true;
        }
        break;
      case 'env':
        break;
      default:
        console.log(
          'Secrets provider not recognized. Please configure it manually.',
        );
    }
    switch (this._tachConfig.notifications.email.provider) {
      case 'ses':
        if (!awsConfigured) {
          await this.configureAWS();
          awsConfigured = true;
        }
        break;
      case 'console':
        break;
      default:
        console.log(
          'Email provider not recognized. Please configure it manually.',
        );
    }
    switch (this._tachConfig.notifications.sms.provider) {
      case 'sns':
        if (!awsConfigured) {
          await this.configureAWS();
          awsConfigured = true;
        }
        await this.configureSNS();
        break;
      case 'twilio':
        await this.configureTwilio();
        break;
      case 'console':
        break;
      default:
        console.log(
          'SMS provider not recognized. Please configure it manually.',
        );
    }
    switch (this._tachConfig.recaptcha.provider) {
      case 'google':
        await this.configureGoogleCaptcha();
        break;
      case 'fake':
        break;
      default:
        console.log(
          'Recaptcha provider not recognized. Please configure it manually.',
        );
    }

    this.saveEnvAndSecrets();
    this.saveTachConfig();
  }

  private async configureBase() {
    const answers = await inquirer.prompt(this._questions.base);

    this._env.NODE_ENV = answers.isLocal ? 'development' : 'production';
    this._env.EXPOSE_ERROR_STACK = answers.isLocal ? 'true' : 'false';

    this._env.TACH_SST_STAGE = answers.envName;
    this._env.TACH_SST_APP_NAME = answers.appId;
    this._env.TACH_APPLICATION_NAME = answers.appName;
    this._env.TACH_PASSWORD_PROTECTED = answers.isPasswordProtected
      ? 'true'
      : 'false';

    if (answers.isPasswordProtected) {
      await this.configurePasswordProtection();
    }

    // configure all secrets
    this._secrets.NEXTAUTH_SECRET = crypto.randomBytes(32).toString('hex');
    this._secrets.TACH_NEXTAUTH_JWT_SECRET = crypto
      .randomBytes(32)
      .toString('hex');
  }

  private async configurePasswordProtection() {
    const answers = await inquirer.prompt(
      this._questions['password-protection'],
    );
    this._env.TACH_PASSWORD_PROTECTED = 'true';
    this._secrets.TACH_PASSWORD_PROTECTED_USERNAME = answers.username;
    this._secrets.TACH_PASSWORD_PROTECTED_PASSWORD = answers.password;
  }

  private async configureTachConfig() {
    const answers = await inquirer.prompt(this._questions['tach-config']);
    this._tachConfig.storage.data.provider = answers.dataStorageProvider;
    this._tachConfig.storage.files.provider = answers.fileStorageProvider;
    this._tachConfig.storage.seed.data.provider =
      answers.seedDataStorageProvider;
    this._tachConfig.storage.seed.files.provider =
      answers.seedFileStorageProvider;
    this._tachConfig.auth.providers = answers.authProviders;
    this._tachConfig.logging.provider = answers.loggingProvider;
    this._tachConfig.payment.provider = answers.paymentProvider;
    this._tachConfig.secrets.provider = answers.secretsProvider;
    this._tachConfig.notifications.email.provider = answers.emailProvider;
    this._tachConfig.notifications.sms.provider = answers.smsProvider;
    this._tachConfig.recaptcha.provider = answers.recaptchaProvider;
  }

  private async configureSSLCert() {
    const answers = await inquirer.prompt(this._questions['ssl-cert']);
    if (!answers.isSslCertCreated) {
      await this.configureSSLCertCreation();
    } else {
      if (!this._env.TACH_SST_DOMAIN_NAME) {
        await this.configureSSLCertCreation();
      }
      await this.configureSSLCertArn();
    }
  }

  private async configureSSLCertCreation() {
    const answers = await inquirer.prompt(this._questions['ssl-cert-creation']);
    this._env.TACH_SST_DOMAIN_NAME = answers.domainName;
  }

  private async configureSSLCertArn() {
    const answers = await inquirer.prompt(this._questions['ssl-cert-arn']);
    this._env.TACH_SST_CERTIFICATE_ARN = answers.certArn;
  }

  private async configureUrls() {
    const answers = await inquirer.prompt(this._questions.urls);
    if (answers.autofill) {
      this.automaticallyConfigureUrls();
    } else {
      await this.manuallyConfigureUrls();
    }
  }

  private async automaticallyConfigureUrls() {
    const stage = this._env.TACH_SST_STAGE;
    let baseUrl = `https://${this._env.TACH_SST_DOMAIN_NAME}`;
    if (stage === 'dev') {
      baseUrl = `https://dev.${this._env.TACH_SST_DOMAIN_NAME}`;
    } else if (stage === 'prod') {
      baseUrl = `https://www.${this._env.TACH_SST_DOMAIN_NAME}`;
    }
    this._env.NEXTAUTH_URL = baseUrl;
    this._env.NEXT_PUBLIC_BASE_URL = baseUrl;
    this._env.NEXT_PUBLIC_API_URL = `${baseUrl}/api`;
  }

  private async manuallyConfigureUrls() {
    const answers = await inquirer.prompt(this._questions['manual-urls']);
    this._env.NEXTAUTH_URL = answers.baseUrl;
    this._env.NEXT_PUBLIC_BASE_URL = answers.baseUrl;
    this._env.NEXT_PUBLIC_API_URL = answers.apiUrl;
  }

  private async configureWebsiteTracking() {
    const answers = await inquirer.prompt(this._questions['website-tracking']);
    if (answers.websiteTrackingProvider === 'hotjar') {
      await this.configureHotjar();
    }
  }

  private async configureHotjar() {
    const answers = await inquirer.prompt(this._questions.hotjar);
    this._env.NEXT_PUBLIC_HOTJAR_HJID = answers.hotjarId;
    this._env.NEXT_PUBLIC_HOTJAR_HJSV = answers.hotjarVersion;
  }

  private async configureCaptcha() {
    const answers = await inquirer.prompt(this._questions.captcha);
    if (answers.captchaProvider === 'google') {
      await this.configureGoogleCaptcha();
    }
    this._tachConfig.recaptcha.provider = answers.captchaProvider;
  }

  private async configureGoogleCaptcha() {
    const answers = await inquirer.prompt(this._questions['captcha-google']);
    this._env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY = answers.siteKey;
    this._secrets.TACH_GOOGLE_RECAPTCHA_SECRET_KEY = answers.secretKey;
  }

  private async configurePayments() {
    const answers = await inquirer.prompt(this._questions.payments);
    if (answers.paymentProvider === 'stripe') {
      await this.configureStripe();
      this._tachConfig.payment.provider = 'stripe';
    } else if (answers.paymentProvider === 'paypal') {
      await this.configurePaypal();
      this._tachConfig.payment.provider = 'paypal';
    }
  }

  private async configureStripe() {
    const answers = await inquirer.prompt(this._questions.stripe);
    this._env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = answers.publishableKey;
    this._secrets.TACH_STRIPE_SECRET_KEY = answers.secretKey;
    this._secrets.TACH_STRIPE_WEBHOOK_SIGNATURE = answers.webhookSecret;
  }

  private async configurePaypal() {
    const answers = await inquirer.prompt(this._questions.paypal);
    this._secrets.TACH_PAYPAL_SECRET_KEY = answers.paypalSecret;
  }

  private async configureAWS() {
    const answers = await inquirer.prompt(this._questions.aws);
    this._env.TACH_AWS_REGION = answers.region;
    this._env.TACH_AWS_ACCOUNT_ID = answers.accountId;
    this._env.TACH_AWS_PROFILE = answers.profile;
    await this.configureAWSServiceAccount();
  }

  private async configureAWSServiceAccount() {
    const answers = await inquirer.prompt(
      this._questions['aws-service-account'],
    );
    this._env.TACH_AWS_ACCESS_KEY_ID = answers.accessKeyId;
    this._secrets.TACH_AWS_SECRET_ACCESS_KEY = answers.secretAccessKey;
  }

  private async configureFileStorage() {
    const answers = await inquirer.prompt(this._questions['file-storage']);
    if (answers.fileStorageProvider === 's3') {
      await this.configureS3();
      this._tachConfig.storage.files.provider = 's3';
    } else if (answers.fileStorageProvider === 'mongodb') {
      await this.configureMongoDB();
      this._tachConfig.storage.files.provider = 'mongodb';
    }
  }

  private async configureS3() {
    if (!this._s3BucketAlreadyConfigured) {
      const answers = await inquirer.prompt(this._questions.s3);
      this._env.TACH_AWS_BUCKET_NAME = answers.bucketName;
      this._s3BucketAlreadyConfigured = true;
    }
  }

  private async configureMongoDB() {
    if (!this._mongoUriAlreadyConfigured) {
      const answers = await inquirer.prompt(this._questions.mongodb);
      this._secrets.TACH_MONGO_URI = answers.connectionString;
      this._mongoUriAlreadyConfigured = true;
    }
  }

  private async configureDataStorage() {
    const answers = await inquirer.prompt(this._questions['data-storage']);
    if (answers.dataStorageProvider === 'mongodb-atlas-data-api') {
      await this.configureMongoDBAtlasDataAPI();
      this._tachConfig.storage.data.provider = 'mongodb-atlas-data-api';
    } else if (answers.dataStorageProvider === 'mongodb') {
      await this.configureMongoDB();
      this._tachConfig.storage.data.provider = 'mongodb';
    }
  }

  private async configureMongoDBAtlasDataAPI() {
    const answers = await inquirer.prompt(
      this._questions['mongodb-atlas-data-api'],
    );
    this._secrets.TACH_MONGO_DATA_API_URI = answers.apiUrl;
    this._secrets.TACH_MONGO_DATA_API_KEY = answers.apiKey;
    this._secrets.TACH_MONGO_DATA_API_DATA_SOURCE = answers.dataSource;
    this._secrets.TACH_MONGO_DATA_API_DATABASE_NAME = answers.databaseName;
  }

  private async configureEmail() {
    const answers = await inquirer.prompt(this._questions.email);
    this._env.TACH_CONTACT_EMAIL_ADDRESS = answers.emailContactAddress;
    this._env.TACH_FROM_EMAIL_ADDRESS = answers.emailFromAddress;
  }

  private async configureSMS() {
    const answers = await inquirer.prompt(this._questions.sms);
    if (answers.provider === 'sns') {
      await this.configureSNS();
      this._tachConfig.notifications.sms.provider = 'sns';
    } else if (answers.provider === 'twilio') {
      await this.configureTwilio();
      this._tachConfig.notifications.sms.provider = 'twilio';
    } else if (answers.provider === 'console') {
      this._tachConfig.notifications.sms.provider = 'console';
    }
  }

  private async configureSNS() {
    const answers = await inquirer.prompt(this._questions.sns);
    this._env.TACH_SMS_QUEUE_URL = answers.sqsQueueUrl;
  }

  private async configureTwilio() {
    const answers = await inquirer.prompt(this._questions.twilio);
    this._env.TACH_TWILIO_ACCOUNT_SID = answers.accountSid;
    this._env.TACH_TWILIO_ORIGINATION_NUMBER = answers.originationNumber;
    this._secrets.TACH_TWILIO_AUTH_TOKEN = answers.authToken;
  }

  private async configureAuthProviders() {
    const answers = await inquirer.prompt(this._questions['auth-providers']);
    if (answers.authProviders.includes('google')) {
      await this.configureGoogleOAuth();
    }
    if (answers.authProviders.includes('github')) {
      await this.configureGithubOAuth();
    }
    if (answers.authProviders.includes('linkedin')) {
      await this.configureLinkedinOAuth();
    }
    if (answers.authProviders.includes('azuread')) {
      await this.configureAzureADOAuth();
    }
    this._tachConfig.auth.providers = answers.authProviders;
  }

  private async configureGoogleOAuth() {
    const answers = await inquirer.prompt(this._questions['google-oauth']);
    this._env.TACH_GOOGLE_CLIENT_ID = answers.clientId;
    this._secrets.TACH_GOOGLE_CLIENT_SECRET = answers.clientSecret;
  }

  private async configureGithubOAuth() {
    const answers = await inquirer.prompt(this._questions['github-oauth']);
    this._env.TACH_GITHUB_CLIENT_ID = answers.clientId;
    this._secrets.TACH_GITHUB_CLIENT_SECRET = answers.clientSecret;
  }

  private async configureLinkedinOAuth() {
    const answers = await inquirer.prompt(this._questions['linkedin-oauth']);
    this._env.TACH_LINKEDIN_CLIENT_ID = answers.clientId;
    this._secrets.TACH_LINKEDIN_CLIENT_SECRET = answers.clientSecret;
  }

  private async configureAzureADOAuth() {
    const answers = await inquirer.prompt(this._questions['azuread-oauth']);
    this._env.TACH_AZURE_AD_CLIENT_ID = answers.clientId;
    this._env.TACH_AZURE_AD_TENANT_ID = answers.tenantId;
    this._secrets.TACH_AZURE_AD_CLIENT_SECRET = answers.clientSecret;
  }

  private async configureGithubAPI() {
    const answers = await inquirer.prompt(this._questions['github-api']);
    this._secrets.TACH_GITHUB_API_TOKEN = answers.apiToken;
    this._env.TACH_GITHUB_REPO_NAME = answers.repoName;
    this._env.TACH_GITHUB_REPO_OWNER = answers.repoOwner;
  }

  private async configureSecrets() {
    const answers = await inquirer.prompt(this._questions.secrets);
    this._tachConfig.secrets.provider = answers.secretsProvider;
  }

  private async configureLogging() {
    const answers = await inquirer.prompt(this._questions.logging);
    this._tachConfig.logging.provider = answers.loggingProvider;
  }

  private saveEnvAndSecrets() {
    const envData = Object.entries(this._env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    const secretsData = Object.entries(this._secrets)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    fs.writeFileSync('.env.local', envData);
    fs.writeFileSync('.env.secrets.local', secretsData);
  }

  private saveTachConfig() {
    fs.writeFileSync(
      'tach.config.js',
      `module.exports = ${JSON.stringify(this._tachConfig, null, 2)};`,
    );
  }
}

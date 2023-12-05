# Quickstart

This quickstart is designed to get you up and running with a fully functioning ecommerce test site in as little time as possible. It will walk through setting up the local development environment, configuring external resources, and deploying the application to AWS.

## Pre-requisites

- [AWS Account](https://aws.amazon.com/)
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [GitHub Account](https://github.com)
- [GitHub Repo](https://github.com)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Cloned RA](https://github.com/Tach-Ignite/tach-ra-web)

## 1. AWS SSO Configuration

SSO is used for deployment of the application. It is also necessary if you're using the `ssm` secrets provider locally. Follow [this guide](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html) to configure SSO.

In order for the `ssm` secrets provider to work, you need to configure your SSO profile to be your `default` profile.

To log in via SSO via the default profile, run the following command:

```bash
aws sso login
```

Once SSO is configured, set the TACH_AWS_PROFILE variable in the `.env.local` and `.env.dev` files to the name of your SSO profile to `default`.

## 2. Local Development Setup

```bash
chmod +x ./localInit.sh && ./localInit.sh && export NODE_ENV=development && cd infra && docker-compose up -d && cd .. && pnpm data:seed
```

_Note_ The seeder will work at this point as long as the `secrets.provider` is configured as `env` in the `tach.config.js` file. If you want to use the `ssm` secrets provider, you will need to run `pnpm data:seed` after completing the AWS Configuration section below.

At this point, your site should be fully functional locally. For more info, see the [Local Development Setup](/docs/local_development_setup.md) section.

## 3. Tach Configuration

Modify the `tach.config.js` file to prepare for running the application in the cloud by setting:

- the `files.provider` setting from `mongodb` to `s3`
- the `secrets.provider` setting from `env` to `ssm`

## 4. GitHub Repo

Once you've created a GitHub repo for your project, you will need to set the `TACH_GITHUB_REPO` and `TACH_GITHUB_REPO_OWNER` variables in the `.env.local` and `.env.dev` files to your repo name. These are used to create the OpenID Link between GitHub and AWS to allow for GitHub Actions to deploy your application.

## 5. AWS Configuration

We must configure AWS to deploy the application. Once you have created an AWS account, you'll need to fill in the following environment variables in the `.env.local` and `.env.dev` files:

- TACH_AWS_ACCOUNT_ID
- TACH_AWS_REGION

### 5.1 Service Account Configuration

The service account has the permissions necessary to run basic AWS services like SES and S3.

#### 5.1.1 Pick an S3 Bucket Name

You will need to pick a bucket name to use for public file storage. Fill in the `TACH_AWS_BUCKET_NAME` variable in the `.env.local` and `.env.dev` files with the desired bucket name.

#### 5.1.2 Create a Service User

Create a service user and user group in IAM with the following policy attached. Make sure to replace tokens with your chosen bucket name:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListObjectsInBucketAndAmplifyUpdateApp",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::{{TACH_AWS_BUCKET_NAME}}"]
    },
    {
      "Sid": "AllObjectActions",
      "Effect": "Allow",
      "Action": ["s3:*Object"],
      "Resource": ["arn:aws:s3:::{{TACH_AWS_BUCKET_NAME}}/*"]
    },
    {
      "Sid": "SES",
      "Effect": "Allow",
      "Action": ["ses:SendEmail", "ses:SendTemplatedEmail", "ses:SendRawEmail"],
      "Resource": "*"
    }
  ]
}
```

### 5.1.3 Service User Access Key

You will need to create an access key for the service user and apply the access. See [this guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) to learn about creating an access key. The relevant section is `To create, modify, or delete the access keys of another IAM user (console)`. The `local code` use case makes the most sense. Once you have the `Access Key` and `Secret Access Key`, apply these to the `TACH_AWS_ACCESS_KEY_ID` variable in the `.env.local` and `.env.dev` files, and the `TACH_AWS_ACCESS_KEY_SECRET` variable in the `.env.secrets.local` and `.env.secrets.dev` files.

![Create Access Key](images/service-user.png 'Create Access Key')

#### 5.1.4 Set up Github Actions Access

We will setup an Open Id Connect provider in IAM so Github has the permissions necessary to release our infradstructure and code:

```bash
pnpm setup-git-aws-connectivity
```

### 5.2 Route 53 Configuration

Ideally you are using route 53 to manage your domain. If you aren't, you will need to manually add DNS records to:

- Verify your domain for SES
- Verify your domain for ACM
- Associate your domain with the CloudFront distribution

For more information on how to set this up, see the [Route 53 docs](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html). If your domain is already hosted somewhere else, see [this guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/MigratingDNS.html) for how to migrate your DNS to Route 53.

### 5.3 Simple Email Service (SES) Configuration

The RA uses SES to send emails for registration, password reset, and contact forms. You will need to configure SES to send emails from your domain. For more information on how to set this up, see the [SES docs](https://docs.aws.amazon.com/ses/latest/dg/setting-up.html). To send emails in sandbox mode, you will need to do the following:

- Verify your domain
- Verify the emails you'll be sending to and from

Once done, set the `TACH_EMAIL_CONTACT_ADDRESS` and `TACH_EMAIL_SOURCE` variables in the `.env.local` and `.env.dev` files to the email address(es) you verified.

## 6. MongoDB Setup

We recommend using MongoDB Atlas for your database. You can use a free tier cluster for development and a paid tier cluster for production. For more information on how to set this up, see the [MongoDB docs](https://docs.atlas.mongodb.com/getting-started/). Be sure to configure the database to use AWS in your preferred region. Eventually we will setup an AWS PrivateLink for more security. In the meantime, you can setup network access to whitelist all IP addresses (0.0.0.0/0). You will also need to setup a user for access.

You should set the `TACH_MONGO_URI` variable in the `.env.secrets.dev` file to your Atlas connection string.

To seed the database, run the following command:

```bash
pnpm data:seed:dev
```

## 7. Recaptcha Setup

Recaptcha is used to protect the site from DDOS or other bot attacks in conjunction with public-facing forms. The Recaptcha site will walk you through account creation [here](https://www.google.com/recaptcha/admin/enterprise). Once you have created an account, you will need to create a site key and secret key. You will need to set the `TACH_RECAPTCHA_SITE_KEY` variable in the `.env.local` and `.env.dev` files to your site key, and the `TACH_RECAPTCHA_SECRET_KEY` variable in the `.env.secrets.local` and `.env.secrets.dev` files to your secret key.

## 8. Hotjar Setup (Optional)

The RA uses HotJar to track user behavior. You can create a free account [here](https://www.hotjar.com/). Once you have created an account, you will need to create a site id. You will need to set the `TACH_HOTJAR_SITE_ID` variable in the `.env.local` and `.env.dev` files to your site id.

## 9. Stripe Setup

We recommend Stripe for payment processing. Create a stripe account at https://www.stripe.com and navigate to the dashboard. Test mode is fine for now. Navigate to the [API keys](https://dashboard.stripe.com/test/apikeys) section and create a standard API key. You will need to set the `TACH_STRIPE_PUBLISHABLE_KEY` variable in the `env.local` and `.env.dev` files to your publishable key and the `TACH_STRIPE_SECRET_KEY` variable in the `.env.secrets.local` and `.env.secrets.dev` files to your secret key.

Once you're ready to move to production, you will need a webhook signature to validate webhook calls. See the [webhooks](https://dashboard.stripe.com/test/webhooks) section in the dashboard. You will need to set the `TACH_STRIPE_WEBHOOK_SIGNATURE` variable in the `.env.secrets.dev` file to your webhook secret.

## 10. Password Protection

Password Protection is enabled by default. To set the username and password, set the `TACH_PASSWORD_PROTECTED_USERNAME` and `TACH_PASSWORD_PROTECTED_PASSWORD` variables in the `.env.secrets.local` and `.env.secrets.dev` files to your desired username and password. To remove password protection, simply remove the password protected middleware from the `middleware.ts` file.

See the [Password Protection](/docs/password_protection.md) section for more information.

## 11. Application Name

Set the `TACH_APPLICATION_NAME` variable in the `.env.local` and `.env.dev` files to your desired application name.

Set the `TACH_SST_APP_NAME` variable in the `.env.local` and `.env.dev` files to your desired application name. This is used by SST to name all of the resources created within AWS.

## 12. Authenticate with AWS SSO

Ensure you are logged into AWS by running the following command to authenticate with AWS SSO:

```bash
aws sso login --profile={{YOUR PROFILE}}
```

## 13. Deploy to AWS

To deploy your app to AWS, run the following command:

```bash
pnpm deploy-app
```

This will take some time to run, especially the first time while it sets up resources needed to manage deployments.

### 13.1 Deployment Known Issues

- Special characters in file names will cause issues with CloudFront. One example of an unexpected special character is when copying files using the windows file explorer to a WSL directory. This will create a second file that contains metadata with a colon in the name.
- The S3 bucket will not be deleted if there is a rollback because of an error. If this is the first time deploying, you will need to manually delete the bucket to redeploy.

## 14. Update Domain Environment Variables

Once the application is deployed, you will need to update the environment variables for the domain. Note CloudFront url that is generated by the deployment, then set the `NEXTAUTH_URL`, `NEXT_PUBLIC_API_URL`, and `NEXT_PUBLIC_BASE_URL` variables in the `.env.local` and `.env.dev` files to utilize the cloudfront url instead of `https://localhost:3000`.

## 15. OAuth Setup

Due to a limitation in NextAuth, you will need at least one OAuth provider configured. We recommend using GitHub. You can learn more about how to create a an OAuth app in GitHub [here](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app). For now, you will use your cloudfront url. For more information on how to configure the callback, see the [NextAuth docs](https://next-auth.js.org/configuration/providers/oauth). Once you have created an OAuth app, you will need to set the `TACH_GITHUB_CLIENT_ID` variable in the `.env.local` and `.env.dev` files to your client id and the `TACH_GITHUB_CLIENT_SECRET` variable in the `.env.secrets.local` and `.env.secrets.dev` files to your client secret.

![GitHub OAuth Configuration](images/github-oauth.png 'GitHub OAuth Configuration')

You are free to repeat this process for other OAuth providers such as LinkedIn, Google, and Azure.

## 16 Deploy Secrets to SSM

We can utilize a script to deploy the secrets to SSM. In the bottom of the `deployEnvVars.ts` file at the project root, ensure the `addSecretsToSSM()` function is uncommented and the other functions are commented out:

```typescript
//addSecretsToGitHub();
// addEnvVarsToAmplify();
addSecretsToSSM();
```

Then run the following command:

```bash
pnpm deploy-env-vars
```

## 16. Redeploy the Environment Variables

Once the environment variables are updated, you will need to redeploy the application to utilize the new environment variables. Run the following command:

```bash
pnpm deploy-app
```

## Removing Deployed Resources

To remove deployed resources, run the following command:

```bash
pnpm remove-app
```

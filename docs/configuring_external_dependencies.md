# Configuring External Dependencies

This application has some external dependencies. Each external dependency being utilized must be configured. We will walk through how to configure these dependencies in the following sections.

## Stripe

For more information on configuring Stripe, see [this guide](https://stripe.com/docs/development/quickstart).

For more information on installing the Stripe CLI, see [this guide](https://stripe.com/docs/stripe-cli).

## AWS S3

Images for the application are stored in S3. You must have an AWS Account and an S3 Bucket to store images. For more information on how to create an AWS account, see [this guide](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html).

Once your account is created, you'll need to create and configure an S3 bucket. For more information, see [this guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html). Default bucket settings should be fine for this application. Your S3 bucket will need to be configured for CORS. For more information, see [this guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html).

Once complete, you will need to add the following environment variables to your .env.local file: `TACH_AWS_ACCESS_KEY_ID`, `TACH_AWS_SECRET_ACCESS_KEY`, `TACH_AWS_BUCKET_NAME`, and `TACH_AWS_REGION`.

## AWS SES

The RA utilizes SES to send emails. The basic AWS requirements are the same as S3. However, you must also do the following:

1. Validate domain ownership from which emails will originate
2. Validate email addresses from which emails will originate
3. For sandbox mode, you must also validate email addresses to which emails will be sent

By default, SES is in sandbox mode which is quite restrictive. For more information on how to configure SES, see [this guide](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/quick-start.html).

## AWS SSM

The RA utilizes Systems Manager Parameter Store to manage secrets. For more information, see the section on [secrets](/docs/secrets.md).

For more information on how to configure SSM, see [this guide](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html).

## HotJar

The RA uses hotjar for tracking user behavior. To configure hotjar, you will need to create an account. For more information, see [this guide](https://help.hotjar.com/hc/en-us/articles/115011789248-Getting-Started-with-Hotjar).

Once your account is created, you will need to add the following environment variables to your .env.local file: `NEXT_PUBLIC_HOTJAR_HJID` and `NEXT_PUBLIC_HOTJAR_HJSV`. These correspond with your HotJar Id and version.

## OAuth Providers

The application supports several OAuth Providers. You will need to configure each one you plan on using. The following sections will walk you through how to configure each provider.

### Google

For information on how to configure Google OAuth, see [this guide](https://support.google.com/cloud/answer/6158849?hl=en).

For local development, you will need to configure your OAuth Credentials accordingly:

- Authorized JavaScript origins: https://localhost:3000
- Authorized redirect URIs: https://localhost:3000/api/auth/callback/google

Once complete, copy or download the client secrets. You will need to add these to your .env.local file as `TACH_GOOGLE_CLIENT_ID` and `TACH_GOOGLE_CLIENT_SECRET`.

### GitHub

For information on how to configure GitHub OAuth, see [this guide](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

For local development, you will need to configure your OAuth Credentials accordingly:

- Homepage URL: https://localhost:3000
- Authorization callback URL: https://localhost:3000/api/auth/callback/github

Once complete, copy or download the client secrets. You will need to add these to your .env.local file as `TACH_GITHUB_CLIENT_ID` and `TACH_GITHUB_CLIENT_SECRET`.

### Azure AD

For information on how to configure Azure AD OAuth, see [this guide](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app).

For local development, you will need to configure your OAuth Credentials accordingly:

- Front-channel logout URL: https://localhost:3000/api/auth/signOut
- Authorized redirect URIs: https://localhost:3000/api/auth/callback/azure-ad

Once complete, copy or download the tenant and client secrets. You will need to add these to your .env.local file as `TACH_AZURE_AD_TENANT_ID`, `TACH_AZURE_AD_CLIENT_ID` and `TACH_AZURE_AD_CLIENT_SECRET`.

### LinkedIn

For information on how to configure LinkedIn OAuth, see [this guide](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fcontext&tabs=HTTPS1).

For local development, you will need to configure your OAuth Credentials accordingly:

- Authorized redirect URLs: https://localhost:3000/api/auth/callback/linkedin
- OAuth 2.0 scopes: r_liteprofile, r_emailaddress

Once complete, copy or download the tenant and client secrets. You will need to add these to your .env.local file as `TACH_LINKEDIN_CLIENT_ID` and `TACH_LINKEDIN_CLIENT_SECRET`.

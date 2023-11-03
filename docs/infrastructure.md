# Infrastructure

This RA utilizes [SST](https://sst.dev) to manage infrastructure as code and releases. It is a lightweight framework that produces and runs AWS cloudformation templates from code, with helpers for nextjs.

## Setup

To utilize SST, you'll need to [configure the AWS CLI for SSO](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html). Here is an example `~/.aws/config` file:

```bash
[default]
aws_access_key_id=ABC123
aws_secret_access_key=ABC234/XYZ345

[sso-session tachcolorstore-sso]
sso_region = us-east-1
sso_start_url = https://tachcolorstore.awsapps.com/start

[profile tachcolorstore-dev]
sso_session = tachcolorstore-sso
sso_account_id = 123456789012
region = us-east-1
sso_role_name = AdministratorAccess
```

Then run the following command:

```bash
aws sso login --profile={your local profile name}
```

Our methodology assumes you have your domain listed as a hosted zone in route 53. However, everything should still work regardless of where your domain is hosted so long as it supports CNAME records.

## Usage

To run the deployment, which will create or update all necessary and configured AWS resources as well as deploy the app to the cloud, execute this command:

```bash
pnpm deploy-app
```

## Custom Domain

When running this for the first time, the deployment will hang when creating the certificate for the custom domain. This is because SST will not automatically add the necessary CNAME records to validate the domain. To continue the deployment, you must add the records manually.

### Domain Verification

For a detailed account on domain validation with AWS Certificate Manager (ACM), see [the guide](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html). Otherwise, below are short descriptions on the process.

#### Domain Verification: Route 53

If you're using Route 53, there is a more convenient way to add these records: go into the AWS Certificate Manager (ACM) Console, locate your certificate, and on the console page for that certificate in the `Domains` section, there is a button labeled "Create Records in Route 53." Click it and follow any further instructions.

#### Domain Verification: Anywhere Else

If you're hosting your domain externally, you'll need to manually add the CNAME records to your DNS. To find the CNAME records you need to add, navigate to the AWS Certificate Manager (ACM) Console and locate your certificate. You will find the CNAME name and value you need to add to your DNS entries. Note that there may be two of them, one for `*.mydomain.com` and one for `mydomain.com`. The CNAME names and values are identical for these, so you only need to add one CNAME entry to cover both.

It may take up to 72 hours to validate an external domain

## Manual Steps

For now, there is no automation of the configuration of Simple Email Service (SES). To learn more about this process, see [the guide](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html).

## CI/CD

The SST deployment is built directly into the github workflow included in the RA. However, you will need to run the deployment once from your local machine first. This step is required because, as a part of the deployment config, it creates the necessary Open ID setup in AWS to allow github actions the necessary permissions to deploy.

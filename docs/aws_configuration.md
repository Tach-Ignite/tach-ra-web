# AWS Configuration

## SSO Configuration

SSO is used for deployment of the application. It is also necessary if you're using the `ssm` secrets provider locally. Follow [this guide](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html) to configure SSO.

In order for the `ssm` secrets provider to work, you need to configure your SSO profile to be your `default` profile.

To log in via SSO via the default profile, run the following command:

```bash
aws sso login
```

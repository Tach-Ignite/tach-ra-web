# Captcha

The RA uses (reCAPTCHA v3)[https://developers.google.com/recaptcha/docs/v3] to prevent spam and abuse. This is a non-intrusive captcha that does not require any user interaction. It also utilizes the `next-recaptcha-v3` package for 1st class nextjs integration.

## Usage

There are three main components for utilizing this capability:

1. The `_app.tsx` app file wraps the application in a `ReCaptchaProvider`
2. The package provides a `useReCaptcha` hook for access to various features and capabilities. In our example, we use the `executeRecaptcha` function to execute the captcha and get a token.
3. Send the token you recieve to the server along with the payload for validation:

```typescript
import { RecaptchaValidator } from '@/lib/services/security/recaptchaValidator';

...

const captchaValidator = new RecaptchaValidator();
  const captchaValidation = await captchaValidator.validateRecaptchaToken(
    request.recaptchaToken,
  );
  if (!captchaValidation.success) {
    return res.status(400).json({ error: 'Invalid Captcha' });
  }

...

```

## Environment Variables

There are two environment variables that must be set for this to work:

- `NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY`: This key is used on the front-end to generate the recaptcha token.
- `TACH_GOOGLE_RECAPTCHA_SECRET_KEY`: This key is used on the back-end to validate the recaptcha token.

These keys can be obtained from the [Google Recaptcha Admin Console](https://www.google.com/recaptcha/admin/create).

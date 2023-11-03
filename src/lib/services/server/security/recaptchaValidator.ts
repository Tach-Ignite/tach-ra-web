import {
  IAsyncMultiProvider,
  IFactory,
  IRecaptchaValidator,
  RecaptchaValidationResponse,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('recaptchaValidator', 'secretsProviderFactory')
export class RecaptchaValidator implements IRecaptchaValidator {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._secretsProvider = secretsProviderFactory.create();
  }

  async validateRecaptchaToken(
    token: string,
  ): Promise<RecaptchaValidationResponse> {
    const googleRecaptchaSecretKey = (await this._secretsProvider.provide(
      'TACH_GOOGLE_RECAPTCHA_SECRET_KEY',
    ))!;
    // validate recaptchaToken
    // Ping the google recaptcha verify API to verify the captcha code you received
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${googleRecaptchaSecretKey}&response=${token}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        method: 'POST',
      },
    );
    const captchaValidation = await response.json();
    /**
   * The structure of response from the veirfy API is
   * {
   *  "success": true|false,
   *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
   *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
   *  "error-codes": [...]        // optional
    }
   */
    const result: RecaptchaValidationResponse = {
      success: captchaValidation.success,
      challengeTimestamp: captchaValidation.challenge_ts,
      hostname: captchaValidation.hostname,
      errorCodes: captchaValidation['error-codes'],
    };
    return result;
  }
}

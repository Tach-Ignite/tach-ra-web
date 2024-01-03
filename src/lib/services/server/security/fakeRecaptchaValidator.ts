import {
  IRecaptchaValidator,
  RecaptchaValidationResponse,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('fakeRecaptchaValidator', 'secretsProviderFactory')
export class FakeRecaptchaValidator implements IRecaptchaValidator {
  async validateRecaptchaToken(
    token: string,
  ): Promise<RecaptchaValidationResponse> {
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
      success: true,
      challengeTimestamp: new Date(Date.now()).toString(),
      hostname: process.env.NEXT_PUBLIC_BASE_URL!,
      errorCodes: [],
    };
    return result;
  }
}

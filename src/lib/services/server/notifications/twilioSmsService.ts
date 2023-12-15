import twilio from 'twilio';
import { IAsyncMultiProvider, IFactory, ISmsService } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';
import { ErrorWithStatusCode } from '@/lib/errors';

@Injectable('twilioSmsService', 'secretsProviderFactory')
export class TwilioSmsService implements ISmsService {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._secretsProvider = secretsProviderFactory.create();
  }

  async sendSms(phoneNumber: string, message: string) {
    try {
      const twilioAuthToken = (await this._secretsProvider.provide(
        'TACH_TWILIO_AUTH_TOKEN',
      ))!;
      const client = twilio(
        process.env.TACH_TWILIO_ACCOUNT_SID!,
        twilioAuthToken,
      );
      const msg = await client.messages.create({
        from: process.env.TACH_TWILIO_ORIGINATION_NUMBER,
        to: phoneNumber,
        body: message,
      });
    } catch (error) {
      throw new ErrorWithStatusCode((error as any).message, 500);
    }
  }
}

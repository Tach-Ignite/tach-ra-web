import {
  IRecaptchaValidator,
  RecaptchaValidationResponse,
  ValidateRecaptchaTokenCommandPayload,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { Command } from '../../command';

@Injectable('validateRecaptchaTokenCommand', 'recaptchaValidator', 'payload')
export class ValidateRecaptchaTokenCommand extends Command<
  ValidateRecaptchaTokenCommandPayload,
  RecaptchaValidationResponse
> {
  private _recaptchaValidator: IRecaptchaValidator;

  constructor(
    recaptchaValidator: IRecaptchaValidator,
    payload: ValidateRecaptchaTokenCommandPayload,
  ) {
    super(payload);
    this._recaptchaValidator = recaptchaValidator;
  }

  async execute(): Promise<void> {
    this.result = await this._recaptchaValidator.validateRecaptchaToken(
      this._payload.recaptchaToken,
    );
  }
}

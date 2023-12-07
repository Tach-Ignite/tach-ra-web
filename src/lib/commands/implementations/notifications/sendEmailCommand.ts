import { IEmailService, SendEmailCommandPayload } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { Command } from '../../command';

@Injectable('sendEmailCommand', 'emailService', 'payload')
export class SendEmailCommand2 extends Command<SendEmailCommandPayload, void> {
  private _emailService: IEmailService;

  constructor(emailService: IEmailService, payload: SendEmailCommandPayload) {
    super(payload);
    this._emailService = emailService;
  }

  async execute(): Promise<void> {
    await this._emailService.sendEmail(
      this._payload.fromEmail,
      this._payload.toEmail,
      this._payload.subject,
      this._payload.body,
    );
  }
}

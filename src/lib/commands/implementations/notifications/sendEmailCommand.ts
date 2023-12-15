import {
  IEmailService,
  IFactory,
  SendEmailCommandPayload,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { Command } from '../../command';

@Injectable('sendEmailCommand', 'emailServiceFactory', 'payload')
export class SendEmailCommand extends Command<SendEmailCommandPayload, void> {
  private _emailService: IEmailService;

  constructor(
    emailServiceFactory: IFactory<IEmailService>,
    payload: SendEmailCommandPayload,
  ) {
    super(payload);
    this._emailService = emailServiceFactory.create();
  }

  async execute(): Promise<void> {
    await this._emailService.sendEmail(
      this._payload.fromEmail,
      this._payload.toEmail,
      this._payload.subject,
      this._payload.body,
      this._payload.replyToEmail,
    );
  }
}

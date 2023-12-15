import { IEmailService } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';

@Injectable('fakeConsoleEmailService')
export class FakeConsoleEmailService implements IEmailService {
  async sendEmail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    body: string,
    replyToEmail: string | undefined = undefined,
  ): Promise<void> {
    console.log(
      `Sending email from ${fromEmail} to ${toEmail} with subject ${subject} and body ${body} and replyToEmail ${replyToEmail}`,
    );
  }
}

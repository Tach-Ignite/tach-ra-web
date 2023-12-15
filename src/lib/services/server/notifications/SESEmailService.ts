import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';
import {
  IAsyncMultiProvider,
  IEmailService,
  IFactory,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';

@Injectable('sesEmailService', 'secretsProviderFactory')
export class SESEmailService implements IEmailService {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._secretsProvider = secretsProviderFactory.create();
  }

  async sendEmail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    body: string,
    replyToEmail: string | undefined = undefined,
  ): Promise<void> {
    const awsSecretAccessKey = (await this._secretsProvider.provide(
      'TACH_AWS_SECRET_ACCESS_KEY',
    ))!;
    const client = new SESClient({
      region: process.env.TACH_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.TACH_AWS_ACCESS_KEY_ID!,
        secretAccessKey: awsSecretAccessKey,
      },
    });
    let emailParams: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: fromEmail,
    };

    if (replyToEmail) {
      emailParams = {
        ...emailParams,
        ReplyToAddresses: [replyToEmail],
      };
    }

    const emailResult = await client.send(new SendEmailCommand(emailParams));
    if (emailResult.MessageId === undefined) {
      throw new Error(
        `Failed to send email: ${emailResult.$metadata.httpStatusCode}`,
      );
    }
    client.destroy();
  }
}

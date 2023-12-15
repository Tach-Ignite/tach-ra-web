import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { IAsyncMultiProvider, IFactory, ISmsService } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';

@Injectable('snsSmsService', 'secretsProviderFactory')
export class SnsSmsService implements ISmsService {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._secretsProvider = secretsProviderFactory.create();
  }

  async sendSms(phoneNumber: string, message: string) {
    const awsSecretAccessKey = (await this._secretsProvider.provide(
      'TACH_AWS_SECRET_ACCESS_KEY',
    ))!;
    const client = new SNSClient({
      region: process.env.TACH_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.TACH_AWS_ACCESS_KEY_ID!,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    const response = await client.send(
      new PublishCommand({
        Message: message,
        // One of PhoneNumber, TopicArn, or TargetArn must be specified.
        PhoneNumber: phoneNumber,
      }),
    );
  }
}

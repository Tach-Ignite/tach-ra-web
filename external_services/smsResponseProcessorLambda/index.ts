import { ModuleResolver } from '@/lib/ioc';
import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
  DeleteMessageBatchCommand,
} from '@aws-sdk/client-sqs';
import { Handler } from 'aws-lambda';
import { SmsResponseProcessorLambdaModule } from './modules/smsResponseProcessorLambda.module';
import { IUserService } from '@/abstractions';
const client = new SQSClient({});
const SQS_QUEUE_URL = process.env.TACH_AWS_SMS_RESPONSE_SQS_QUEUE_URL;

const m = new ModuleResolver().resolve(SmsResponseProcessorLambdaModule);
const userService = m.resolve<IUserService>('userService');

export const handler: Handler = async (event, context) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const message = JSON.parse(body.Message);

    console.log(`Received message ${message.MessageId}: ${message.Message}`);

    // Process the message here...
    const phoneNumber = message.originationPhoneNumber;
    // possibly this?
    const phoneNumber2 = message.destinationPhoneNumber;
    const messageBody = message.messageBody;

    const user = await userService.getUserByPhoneNumber(phoneNumber);

    if (!user) {
      console.log(`No user found for phone number ${phoneNumber}`);
    } else {
      if (messageBody === 'IN') {
        const editedUser = await userService.editUser(user!._id!, {
          smsOptInConfirmedViaSms: true,
          smsOptInConfirmedViaSmsDate: new Date(),
        });
      } else if (messageBody === 'STOP') {
        const editedUser = await userService.editUser(user!._id!, {
          smsOptInConfirmedViaSms: false,
          smsOptInConfirmedViaSmsDate: new Date(),
        });
      }
    }

    // After processing the message, delete it from the queue
    const deleteParams = {
      QueueUrl: SQS_QUEUE_URL, // replace with your queue URL
      ReceiptHandle: record.receiptHandle,
    };

    try {
      const deleteMessageCommand = new DeleteMessageCommand(deleteParams);
      const data = await client.send(deleteMessageCommand);
      console.log(`Message ${message.MessageId} deleted: ${data}`);
    } catch (error) {
      console.error(`Failed to delete message ${message.MessageId}: ${error}`);
    }
  }
};

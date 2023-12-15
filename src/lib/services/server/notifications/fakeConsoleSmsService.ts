import { ISmsService } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';

@Injectable('fakeConsoleSmsService', 'secretsProviderFactory')
export class FakeConsoleSmsService implements ISmsService {
  async sendSms(phoneNumber: string, message: string) {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  }
}

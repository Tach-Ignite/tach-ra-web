import { PartialIdModelAndTimestampModel } from '@/lib/abstractions';

export interface IContactRequest extends PartialIdModelAndTimestampModel {
  name: string;
  email: string;
  message: string;
  optedInToEmailAlerts: boolean;
  agreedToPrivacyPolicy: boolean;
}

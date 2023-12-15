import { PartialIdModelAndTimestampModel } from '@/lib/abstractions';

export interface IInterestList extends PartialIdModelAndTimestampModel {
  friendlyId: string;
  name?: string;
  description?: string;
}

export interface IInterestListItem extends PartialIdModelAndTimestampModel {
  email: string;
  phoneNumber?: string;
  interestList: IInterestList;
}

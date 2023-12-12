import { PartialIdModelAndTimestampModel } from '@/lib/abstractions';

export type InterestListItemDto = {
  email: string;
  phone?: string;
  interestListId: string;
} & PartialIdModelAndTimestampModel;

export type InterestListDto = {
  friendlyId: string;
  name?: string;
  description?: string;
} & PartialIdModelAndTimestampModel;

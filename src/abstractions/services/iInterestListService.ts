import { IInterestList, IInterestListItem } from '@/models/domain/interestList';

export interface IInterestListService {
  createInterestList(interestList: IInterestList): Promise<IInterestList>;
  createInterestListItem(
    interestListItem: IInterestListItem,
  ): Promise<IInterestListItem>;
  getInterestList(friendlyId: string): Promise<IInterestList | null>;
  getInterestListItem(
    interestListFriendlyId: string,
    email: string,
  ): Promise<IInterestListItem | null>;
  removeInterestListItemByEmail(
    interestListFriendlyId: string,
    email: string,
  ): Promise<void>;
  removeInterestListByPhoneNumber(
    interestListFriendlyId: string,
    phoneNumber: string,
  ): Promise<void>;
  removeFromAllInterestListsByEmail(email: string): Promise<void>;
  removeFromAllInterestListsByPhoneNumber(phoneNumber: string): Promise<void>;
}

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
}

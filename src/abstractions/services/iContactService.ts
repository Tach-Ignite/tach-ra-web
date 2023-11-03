import { IContactRequest } from '@/models';

export interface IContactService {
  createContactRequest(contactRequest: IContactRequest): Promise<void>;
}

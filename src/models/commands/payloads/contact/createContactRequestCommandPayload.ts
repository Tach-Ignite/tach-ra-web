import { IContactRequest } from '../../../domain/contactRequest';

export type CreateContactRequestCommandPayload = {
  contactRequest: IContactRequest;
};

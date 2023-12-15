import { JSONSchemaType } from 'ajv';
import { IInterestList } from '../domain/interestList';

export type InterestListViewModel = {
  _id: string;
  friendlyId: string;
  name: string;
  description: string;
  createdOn: Date;
  updatedOn: Date;
};

export type AddUserToInterestListViewModel = {
  email: string;
  phoneNumber?: string;
  interestListFriendlyId: string;
  optedInToGenericNotifications: boolean;
  agreedToPrivacyPolicyAndTerms: boolean;
  recaptchaToken: string;
};

export type InterestListItemViewModel = {
  _id: string;
  email: string;
  phoneNumber?: string;
  interestListFriendlyId: string;
  createdOn: Date;
  updatedOn: Date;
};

export const addUserToInterestListViewModelSchema: JSONSchemaType<AddUserToInterestListViewModel> =
  {
    type: 'object',
    properties: {
      email: { type: 'string' },
      phoneNumber: { type: 'string', nullable: true },
      interestListFriendlyId: { type: 'string' },
      optedInToGenericNotifications: { type: 'boolean' },
      agreedToPrivacyPolicyAndTerms: { type: 'boolean' },
      recaptchaToken: { type: 'string' },
    },
    required: ['email', 'interestListFriendlyId', 'recaptchaToken'],
    additionalProperties: false,
  };

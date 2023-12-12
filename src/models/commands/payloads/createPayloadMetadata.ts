import { createCategoryPayloadMetadata } from './categories/createCategoryPayloadMetadata';
import { createInterestListCommandPayloadMetadata } from './interestLists/createInterestListCommandPayloadMetadata';
import { createOrderPayloadMetadata } from './orders/createOrderPayloadMetadata';
import { createProductPayloadMetadata } from './products/createProductPayloadMetadata';
import { createUserAddressPayloadMetadata } from './userAddresses/createUserAddressPayloadMetadata';
import { createUserCommandPayloadMetadata } from './users/createUserCommandPayloadMetadata';

export function createPayloadMetadata() {
  createCategoryPayloadMetadata();
  createUserAddressPayloadMetadata();
  createProductPayloadMetadata();
  createOrderPayloadMetadata();
  createUserCommandPayloadMetadata();
  createInterestListCommandPayloadMetadata();
}

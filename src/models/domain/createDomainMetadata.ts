import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import {
  idModelMetadata,
  timeStampedModelMetadata,
  iAddressMetadata,
} from '@/lib/mapping/automapperTypescript/metadata';
import { IAddress } from './address';
import { IUserAddress } from './userAddress';
import { ICategory, ICategoryProperty } from './category';
import { IProduct } from './product';
import { IOrder } from './order';
import { IUser } from './user';

import { IContactRequest } from './contactRequest';
import { IInterestList, IInterestListItem } from './interestList';
import { ICart, ICartItem } from './cart';

export function createDomainMetadata() {
  PojosMetadataMap.create<IAddress>('IAddress', {
    ...idModelMetadata,
    ...iAddressMetadata,
  });
  PojosMetadataMap.create<IUserAddress>('IUserAddress', {
    ...idModelMetadata,
    recipientName: String,
    address: 'IAddress',
  });
  PojosMetadataMap.create<ICartItem>('ICartItem', {
    product: 'IProduct',
    quantity: Number,
  });
  PojosMetadataMap.create<ICart>('ICart', {
    items: ['ICartItem'],
  });
  PojosMetadataMap.create<IUser>('IUser', {
    ...idModelMetadata,
    name: String,
    image: String,
    emailVerified: Date,
    roles: String,
    email: String,
    defaultUserAddressId: String,
    phoneNumber: String,
    agreedToReceiveSmsNotifications: String,
    smsOptInConfirmedViaSms: Boolean,
    smsOptInConfirmedViaSmsDate: Date,
    smsOptedOutViaSms: Boolean,
    smsOptedOutViaSmsDate: Date,
    addresses: ['IUserAddress'],
    cart: 'ICart',
    disabled: Boolean,
  });
  PojosMetadataMap.create<ICategoryProperty>('ICategoryProperty', {
    ...idModelMetadata,
    name: String,
    values: [String],
  });
  PojosMetadataMap.create<ICategory>('ICategoryParent', {
    ...idModelMetadata,
    name: String,
    categoryProperties: ['ICategoryProperty'],
  });
  PojosMetadataMap.create<ICategory>('ICategory', {
    ...idModelMetadata,
    name: String,
    categoryProperties: ['ICategoryProperty'],
    parent: 'ICategory',
    // TODO: Can't use self reference because of a bug in automapper. The documented syntax causes type errors, and using a string instead of a function for type
    // causes infinite recursion. Using a function like below causes the mapper to use incorrect symbols for the type. instead of the name, it uses 'type'.
    // parent: {
    //   // pass in an object instead
    //   type: (() => 'ICategory') as unknown as PojoMetadata,
    //   depth: 3, // default to 1
    // },
  });
  PojosMetadataMap.create<IProduct>('IProduct', {
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    friendlyId: String,
    brand: String,
    name: String,
    description: String,
    isNew: Boolean,
    oldPrice: Number,
    price: Number,
    quantity: Number,
    categoryPropertyValues: Object,
    categories: ['ICategory'],
    imageUrls: [String],
  });
  PojosMetadataMap.create<IOrder>('IOrder', {
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    user: 'IUser',
    userAddress: 'IUserAddress',
    lineItems: ['ILineItem'],
    paymentStatus: String,
    orderStatus: String,
  });
  PojosMetadataMap.create<IContactRequest>('IContactRequest', {
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    name: String,
    email: String,
    message: String,
    optedInToEmailAlerts: Boolean,
    agreedToPrivacyPolicy: Boolean,
  });
  PojosMetadataMap.create<IInterestList>('IInterestList', {
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    friendlyId: String,
    name: String,
    description: String,
  });
  PojosMetadataMap.create<IInterestListItem>('IInterestListItem', {
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    email: String,
    phoneNumber: String,
    interestList: 'IInterestList',
  });
}

import { Account } from 'next-auth';
import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import {
  IAddress,
  ICountryCodeEnum,
  ILineItem,
  IPaymentStatusEnum,
  IdModel,
  PartialIdModelAndTimestampModel,
  TimeStampedModel,
} from '@/lib/abstractions';
import {
  idModelMetadata,
  timeStampedModelMetadata,
  iAddressMetadata,
} from '@/lib/mapping/automapperTypescript/metadata';
import { IOrderStatusEnum, IUserRolesEnum } from '../enums';

export type AddressDto = Partial<IdModel> &
  IAddress & {
    country: Extract<keyof ICountryCodeEnum, string>;
  };

export type UserAddressDto = {
  addressId: string;
  recipientName: string;
} & IdModel;
export type UserDto = {
  name: string;
  password: string;
  image?: string;
  emailVerified?: Date;
  roles: Extract<keyof IUserRolesEnum, string>[];
  email: string;
  defaultUserAddressId?: string | null;
  addresses: UserAddressDto[];
  token?: string;
  passwordResetToken?: string;
} & Partial<IdModel>;

export type AccountDto = {} & Account;

export type CategoryPropertyDto = {
  name: string;
  values: string[];
} & Partial<IdModel>;

export type CategoryDto = {
  name: string;
  categoryProperties: CategoryPropertyDto[];
  parentId?: string;
  childIds: string[];
} & Partial<IdModel> &
  Partial<TimeStampedModel>;

export type CategoryPropertyValueDto = {
  categoryId: string;
  categoryPropertyId: string;
  value: string;
};

export type ProductDto = {
  friendlyId: string;
  brand: string;
  name: string;
  description: string;
  isNew: boolean;
  oldPrice: number;
  price: number;
  quantity: number;
  categoryPropertyValues: {
    [key: string]: CategoryPropertyValueDto;
  };
  categoryIds: string[];
  imageStorageKeys: string[];
} & Partial<IdModel> &
  Partial<TimeStampedModel>;

export type OrderDto = {
  userId: string;
  userAddressId: string;
  lineItems: ILineItem[];
  checkoutSessionId?: string;
  paymentProvider: string;
  paymentStatus: Extract<keyof IPaymentStatusEnum, string>;
  orderStatus: Extract<keyof IOrderStatusEnum, string>;
} & Partial<IdModel> &
  Partial<TimeStampedModel>;

export type ContactRequestDto = {
  name: string;
  email: string;
  message: string;
  optedInToEmailAlerts: boolean;
  agreedToPrivacyPolicy: boolean;
} & PartialIdModelAndTimestampModel;

export function createDtoMetadata() {
  PojosMetadataMap.create<AddressDto>('AddressDto', {
    ...idModelMetadata,
    ...iAddressMetadata,
  });
  PojosMetadataMap.create<UserAddressDto>('UserAddressDto', {
    ...idModelMetadata,
    addressId: String,
    recipientName: String,
  });
  PojosMetadataMap.create<UserDto>('UserDto', {
    ...idModelMetadata,
    name: String,
    password: String,
    image: String,
    emailVerified: Date,
    roles: String,
    email: String,
    defaultUserAddressId: String,
    addresses: 'UserAddressDto',
    token: String,
    passwordResetToken: String,
  });
  PojosMetadataMap.create<AccountDto>('AccountDto', {
    ...idModelMetadata,
    providerAccountId: String,
    userId: String,
    provider: String,
    type: String,
  });
  PojosMetadataMap.create<CategoryPropertyDto>('CategoryPropertyDto', {
    ...idModelMetadata,
    name: String,
    values: [String],
  });
  PojosMetadataMap.create<CategoryDto>('CategoryDto', {
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    name: String,
    categoryProperties: ['CategoryPropertyDto'],
  });
  PojosMetadataMap.create<ProductDto>('ProductDto', {
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
    categoryIds: [String],
    imageStorageKeys: [String],
  });
  PojosMetadataMap.create<OrderDto>('OrderDto', {
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    userId: String,
    userAddressId: String,
    lineItems: ['ILineItem'],
    paymentStatus: String,
    orderStatus: String,
  });
  PojosMetadataMap.create<ContactRequestDto>('ContactRequestDto', {
    _id: String,
    name: String,
    email: String,
    message: String,
    optedInToEmailAlerts: Boolean,
    agreedToPrivacyPolicy: Boolean,
    createdAt: Date,
    updatedAt: Date,
  });
}

import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { JSONSchemaType } from 'ajv';
import {
  IAddress,
  ICountryCodeEnum,
  IdModel,
  ONE_MEGABYTE,
  TimeStampedModel,
  addressSchema,
  idModelSchema,
  timeStampedModelSchema,
} from '@/lib/abstractions';
import {
  idModelMetadata,
  timeStampedModelMetadata,
  iAddressMetadata,
} from '@/lib/mapping/automapperTypescript/metadata';
import { StringListParameter } from 'aws-cdk-lib/aws-ssm';
import {
  IOrderStatusEnum,
  IUserRolesEnum,
  OrderStatusEnum,
  UserRolesEnum,
} from '../enums';
import { AddUserToInterestListViewModel } from './interestLists';
import { CartItemViewModel, CartViewModel } from './cart';
import {
  CategoryPropertyViewModel,
  CategoryViewModel,
  MutateCategoryPropertyViewModel,
  MutateCategoryViewModel,
} from './category';
import {
  MutateProductViewModel,
  ProductViewModel,
  productViewModelBaseMetadata,
} from './product';

export type FileLike = {
  name: string;
  size: number;
  type: string;
  filepath?: string;
};

export const imageSchema: JSONSchemaType<FileLike> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    size: {
      type: 'number',
      maximum: ONE_MEGABYTE,
      errorMessage: { maximum: 'File size must be less than 1MB' },
    },
    type: {
      type: 'string',
      pattern: '^image/(jpeg|gif|png|webp)$',
      errorMessage: {
        pattern: 'File type must be jpeg, gif, png, or webp',
      },
    },
    filepath: {
      type: 'string',
      nullable: true,
    },
  },
  additionalProperties: true,
  required: ['name', 'size', 'type'],
};

export type AddressViewModel = IAddress &
  Partial<IdModel> & {
    country: Extract<keyof ICountryCodeEnum, string>;
  };

export const addressViewModelSchema: JSONSchemaType<AddressViewModel> = {
  type: 'object',
  properties: {
    ...idModelSchema.properties,
    ...addressSchema.properties,
  },
  required: [...addressSchema.required],
};

export type UserAddressViewModel = {
  recipientName: string;
  address: AddressViewModel;
} & Partial<IdModel>;

export const userAddressViewModelSchema: JSONSchemaType<UserAddressViewModel> =
  {
    type: 'object',
    properties: {
      recipientName: { type: 'string' },
      ...idModelSchema.properties,
      address: addressViewModelSchema,
    },
    required: ['recipientName', 'address'],
  };

export type AllUserAddressesViewModel = {
  defaultUserAddressId: string;
  userAddresses: UserAddressViewModel[];
};

export const allUserAddressesViewModelSchema: JSONSchemaType<AllUserAddressesViewModel> =
  {
    type: 'object',
    properties: {
      defaultUserAddressId: { type: 'string' },
      userAddresses: {
        type: 'array',
        items: userAddressViewModelSchema,
      },
    },
    required: ['defaultUserAddressId', 'userAddresses'],
  };

export type MutateUserAddressViewModel = {
  setAsDefault: boolean;
} & UserAddressViewModel;

export const mutateUserAddressViewModelSchema: JSONSchemaType<MutateUserAddressViewModel> =
  {
    type: 'object',
    properties: {
      setAsDefault: { type: 'boolean' },
      ...userAddressViewModelSchema.properties!,
    },
    required: ['setAsDefault', ...userAddressViewModelSchema.required],
  };

export type UserViewModel = {
  name: string;
  image: string;
  emailVerified: Date | null;
  roles: Extract<keyof IUserRolesEnum, string>[];
  email: string;
  defaultUserAddressId: string | null;
  addresses: UserAddressViewModel[];
  cart: CartViewModel;
} & IdModel &
  Partial<TimeStampedModel>;

export type CreateUserViewModel = {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const passwordSchema: JSONSchemaType<string> = {
  type: 'string',
  minLength: 8,
  errorMessage: { minLength: 'Password must be at least 8 characters.' },
};

export const confirmPasswordSchema: JSONSchemaType<string> = {
  type: 'string',
  const: { $data: '1/password' } as unknown as string,
  errorMessage: { const: 'Passwords must match.' },
};

export const createUserViewModelSchema: JSONSchemaType<CreateUserViewModel> = {
  type: 'object',
  properties: {
    name: { type: 'string', nullable: true },
    email: { type: 'string', format: 'email' },
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  },
  required: ['email', 'password', 'confirmPassword'],
};

export type RequestPasswordResetViewModel = {
  email: string;
};

export const requestPasswordResetViewModelSchema: JSONSchemaType<RequestPasswordResetViewModel> =
  {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
  };

export type UnauthenticatedResetPasswordViewModel = {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
};

export const unauthenticatedResetPasswordViewModelSchema: JSONSchemaType<UnauthenticatedResetPasswordViewModel> =
  {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      token: { type: 'string' },
      password: { type: 'string' },
      confirmPassword: { type: 'string' },
    },
    required: ['email', 'token', 'password', 'confirmPassword'],
    additionalProperties: false,
  };

export type AuthenticatedProfileResetPasswordViewModel = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const authenticatedResetPasswordViewModelSchema: JSONSchemaType<AuthenticatedProfileResetPasswordViewModel> =
  {
    type: 'object',
    properties: {
      currentPassword: { type: 'string', format: 'email' },
      newPassword: { type: 'string' },
      confirmNewPassword: { type: 'string' },
    },
    required: ['currentPassword', 'newPassword', 'confirmNewPassword'],
    additionalProperties: false,
  };

export type SetUserRolesViewModel = {
  roles: Extract<keyof IUserRolesEnum, string>[];
};

export const setUserRolesViewModelSchema: JSONSchemaType<SetUserRolesViewModel> =
  {
    type: 'object',
    properties: {
      roles: {
        type: 'array',
        items: {
          type: 'string',
          enum: UserRolesEnum._keys,
        },
      },
    },
    required: ['roles'],
  };

export type CredentialsViewModel = {
  email: string;
  password: string;
};

export const credentialsViewModelSchema: JSONSchemaType<CredentialsViewModel> =
  {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        minLength: 1,
        errorMessage: { minLength: 'Email is required.' },
      },
      password: passwordSchema,
    },
    required: ['email', 'password'],
    additionalProperties: false,
  };

export type ProductDataViewModel = {
  _id: string;
  name: string;
  description: string;
  imageUrls: string[];
};

export type PriceDataViewModel = {
  currency: Extract<keyof ICountryCodeEnum, string>;
  unitAmount: number;
  productData: ProductDataViewModel;
};

export type LineItemViewModel = {
  quantity: number;
  priceData: PriceDataViewModel;
};

export type OrderViewModel = {
  user: UserViewModel;
  userAddress: UserAddressViewModel;
  lineItems: LineItemViewModel[];
  paymentStatus: string;
  orderStatus: string;
} & IdModel &
  TimeStampedModel;

export type UpdateOrderStatusViewModel = {
  orderStatus: Extract<keyof IOrderStatusEnum, string>;
};

export const updateOrderStatusViewModelSchema: JSONSchemaType<UpdateOrderStatusViewModel> =
  {
    type: 'object',
    properties: {
      orderStatus: {
        type: 'string',
        enum: OrderStatusEnum._keys,
      },
    },
    required: ['orderStatus'],
  };

export type CheckoutViewModel = {
  userAddress: UserAddressViewModel;
};

export type ContactRequestViewModel = {
  name: string;
  email: string;
  message: string;
  optedInToEmailAlerts: boolean;
  agreedToPrivacyPolicy: boolean;
  recaptchaToken: string;
};

export const contactRequestViewModelSchema: JSONSchemaType<ContactRequestViewModel> =
  {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      message: { type: 'string' },
      optedInToEmailAlerts: { type: 'boolean' },
      agreedToPrivacyPolicy: {
        type: 'boolean',
        const: true,
      },
      recaptchaToken: { type: 'string' },
    },
    required: [
      'name',
      'email',
      'message',
      'optedInToEmailAlerts',
      'agreedToPrivacyPolicy',
      'recaptchaToken',
    ],
  };

export type DarkModeConfigurationViewModel = {
  default: 'light' | 'dark' | 'system';
};

export type MutateUserProfileViewModel = {
  name: string;
  phoneNumber: string;
  agreedToReceiveSmsNotifications: boolean;
};

export const mutateUserProfileViewModelSchema: JSONSchemaType<MutateUserProfileViewModel> =
  {
    type: 'object',
    properties: {
      name: { type: 'string' },
      phoneNumber: { type: 'string', format: 'phone' },
      agreedToReceiveSmsNotifications: {
        type: 'boolean',
      },
    },
    required: ['name'],
  };

export function createViewModelMetadata() {
  PojosMetadataMap.create<AddressViewModel>('AddressViewModel', {
    ...idModelMetadata,
    ...iAddressMetadata,
  });
  PojosMetadataMap.create<UserAddressViewModel>('UserAddressViewModel', {
    ...idModelMetadata,
    recipientName: String,
    address: 'AddressViewModel',
  });
  PojosMetadataMap.create<AllUserAddressesViewModel>(
    'AllUserAddressesViewModel',
    {
      defaultUserAddressId: String,
      userAddresses: ['UserAddressViewModel'],
    },
  );
  PojosMetadataMap.create<MutateUserAddressViewModel>(
    'MutateUserAddressViewModel',
    {
      recipientName: String,
      setAsDefault: Boolean,
      address: 'AddressViewModel',
    },
  );
  PojosMetadataMap.create<CategoryPropertyViewModel>(
    'CategoryPropertyViewModel',
    {
      ...idModelMetadata,
      name: String,
      values: [String],
    },
  );
  PojosMetadataMap.create<CategoryViewModel>('CategoryViewModelParent', {
    ...idModelMetadata,
    name: String,
    categoryProperties: ['CategoryPropertyViewModel'],
  });
  PojosMetadataMap.create<CategoryViewModel>('CategoryViewModel', {
    ...idModelMetadata,
    name: String,
    parent: 'CategoryViewModel',
    categoryProperties: ['CategoryPropertyViewModel'],
  });
  PojosMetadataMap.create<MutateCategoryPropertyViewModel>(
    'MutateCategoryPropertyViewModel',
    {
      ...idModelMetadata,
      name: String,
      values: [String],
    },
  );
  PojosMetadataMap.create<MutateCategoryViewModel>('MutateCategoryViewModel', {
    ...idModelMetadata,
    name: String,
    parentId: String,
    categoryProperties: ['MutateCategoryPropertyViewModel'],
  });
  PojosMetadataMap.create<ProductViewModel>('ProductViewModel', {
    ...productViewModelBaseMetadata,
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    categories: ['CategoryViewModel'],
    imageUrls: [String],
  });
  PojosMetadataMap.create<MutateProductViewModel>('MutateProductViewModel', {
    ...productViewModelBaseMetadata,
    categoryIds: [String],
    imageFiles: [Object],
  });
  PojosMetadataMap.create<ProductDataViewModel>('ProductDataViewModel', {
    ...idModelMetadata,
    name: String,
    description: String,
    imageUrls: [String],
  });
  PojosMetadataMap.create<UserViewModel>('UserViewModel', {
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    name: String,
    image: String,
    emailVerified: Date,
    roles: [String],
    email: String,
    defaultUserAddressId: String,
    addresses: ['UserAddressViewModel'],
    cart: 'CartViewModel',
  });
  PojosMetadataMap.create<CreateUserViewModel>('CreateUserViewModel', {
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
  });
  PojosMetadataMap.create<RequestPasswordResetViewModel>(
    'RequestPasswordResetViewModel',
    {
      email: String,
    },
  );
  PojosMetadataMap.create<UnauthenticatedResetPasswordViewModel>(
    'UnauthenticatedResetPasswordViewModel',
    {
      email: String,
      token: String,
      password: String,
      confirmPassword: String,
    },
  );
  PojosMetadataMap.create<AuthenticatedProfileResetPasswordViewModel>(
    'AuthenticatedProfileResetPasswordViewModel',
    {
      currentPassword: String,
      newPassword: String,
      confirmNewPassword: String,
    },
  );
  PojosMetadataMap.create<SetUserRolesViewModel>('SetUserRolesViewModel', {
    roles: [String],
  });
  PojosMetadataMap.create<PriceDataViewModel>('PriceDataViewModel', {
    currency: String,
    unitAmount: Number,
    productData: 'ProductDataViewModel',
  });
  PojosMetadataMap.create<LineItemViewModel>('LineItemViewModel', {
    quantity: Number,
    priceData: 'PriceDataViewModel',
  });
  PojosMetadataMap.create<OrderViewModel>('OrderViewModel', {
    ...idModelMetadata,
    ...timeStampedModelMetadata,
    user: 'UserViewModel',
    userAddress: 'UserAddressViewModel',
    lineItems: ['LineItemViewModel'],
    paymentStatus: String,
    orderStatus: String,
  });
  PojosMetadataMap.create<UpdateOrderStatusViewModel>(
    'UpdateOrderStatusViewModel',
    {
      orderStatus: String,
    },
  );
  PojosMetadataMap.create<CartItemViewModel>('CartItemViewModel', {
    product: 'ProductViewModel',
    quantity: Number,
  });
  PojosMetadataMap.create<CartViewModel>('CartViewModel', {
    items: ['CartItemViewModel'],
  });
  PojosMetadataMap.create<CheckoutViewModel>('CheckoutViewModel', {
    userAddress: 'UserAddressViewModel',
  });
  PojosMetadataMap.create<ContactRequestViewModel>('ContactRequestViewModel', {
    name: String,
    email: String,
    message: String,
    optedInToEmailAlerts: Boolean,
    agreedToPrivacyPolicy: Boolean,
    recaptchaToken: String,
  });
  PojosMetadataMap.create<DarkModeConfigurationViewModel>(
    'DarkModeConfigurationViewModel',
    {
      default: String,
    },
  );
  PojosMetadataMap.create<MutateUserProfileViewModel>(
    'MutateUserProfileViewModel',
    {
      name: String,
      phoneNumber: String,
      agreedToReceiveSmsNotifications: Boolean,
    },
  );
  PojosMetadataMap.create<AddUserToInterestListViewModel>(
    'AddUserToInterestListViewModel',
    {
      email: String,
      phoneNumber: String,
      interestListFriendlyId: String,
      optedInToGenericNotifications: Boolean,
      agreedToPrivacyPolicyAndTerms: Boolean,
      recaptchaToken: String,
    },
  );
}

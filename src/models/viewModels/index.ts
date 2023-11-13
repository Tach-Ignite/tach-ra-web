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
import {
  IOrderStatusEnum,
  IUserRolesEnum,
  OrderStatusEnum,
  UserRolesEnum,
} from '../enums';

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

export type CategoryPropertyViewModel = {
  name: string;
  values: string[];
} & IdModel;

export const categoryPropertyViewModelSchema: JSONSchemaType<CategoryPropertyViewModel> =
  {
    type: 'object',
    properties: {
      ...idModelSchema.properties,
      name: { type: 'string' },
      values: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['name', 'values'],
  };

export type CategoryViewModel = {
  name: string;
  parent?: CategoryViewModel;
  categoryProperties: CategoryPropertyViewModel[];
} & IdModel;

export const categoryViewModelSchema: JSONSchemaType<CategoryViewModel> = {
  type: 'object',
  properties: {
    ...idModelSchema.properties,
    name: { type: 'string' },
    parent: {
      $ref: '#',
    },
    categoryProperties: {
      type: 'array',
      items: categoryPropertyViewModelSchema,
    },
  },
  required: ['name', 'categoryProperties'],
  additionalProperties: false,
};

export type MutateCategoryPropertyViewModel = {
  name: string;
  values: string;
} & Partial<IdModel>;

export const mutateCategoryPropertyViewModelSchema: JSONSchemaType<MutateCategoryPropertyViewModel> =
  {
    type: 'object',
    properties: {
      ...idModelSchema.properties,
      name: { type: 'string' },
      values: {
        type: 'string',
      },
    },
    required: ['name', 'values'],
  };

export type MutateCategoryViewModel = {
  name: string;
  parentId?: string;
  categoryProperties?: MutateCategoryPropertyViewModel[];
};

export const mutateCategoryViewModelSchema: JSONSchemaType<MutateCategoryViewModel> =
  {
    type: 'object',
    properties: {
      ...idModelSchema.properties,
      name: { type: 'string' },
      parentId: { type: 'string', nullable: true },
      categoryProperties: {
        type: 'array',
        nullable: true,
        items: mutateCategoryPropertyViewModelSchema,
      },
    },
    required: ['name'],
    additionalProperties: false,
  };

export type CategoryPropertyValueViewModel = {
  categoryId: string;
  categoryPropertyId: string;
  value: string;
};

export const categoryPropertyValueViewModelSchema: JSONSchemaType<CategoryPropertyValueViewModel> =
  {
    type: 'object',
    properties: {
      categoryId: {
        type: 'string',
      },
      categoryPropertyId: {
        type: 'string',
      },
      value: {
        type: 'string',
      },
    },
    required: ['categoryId', 'categoryPropertyId', 'value'],
  };

type ProductViewModelBase = {
  friendlyId: string;
  brand: string;
  name: string;
  description: string;
  isNew: boolean;
  oldPrice: number;
  price: number;
  quantity: number;
  categoryPropertyValues?: { [key: string]: CategoryPropertyValueViewModel };
};
const productViewModelBaseMetadata = {
  friendlyId: String,
  brand: String,
  name: String,
  description: String,
  isNew: Boolean,
  oldPrice: Number,
  price: Number,
  quantity: Number,
  categoryPropertyValues: Object,
};

const productViewModelBaseSchema: JSONSchemaType<ProductViewModelBase> = {
  type: 'object',
  properties: {
    friendlyId: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Friendly Id is required.' },
    },
    brand: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Brand is required.' },
    },
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Name is required.' },
    },
    description: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Description is required.' },
    },
    isNew: {
      type: 'boolean',
    },
    oldPrice: {
      type: 'number',
      minimum: 0,
      multipleOf: 0.01,
      errorMessage: { nullable: 'Price is required.' },
    },
    price: {
      type: 'number',
      minimum: 0,
      multipleOf: 0.01,
      errorMessage: { nullable: 'Price is required.' },
    },
    quantity: {
      type: 'integer',
      errorMessage: { const: 'Quantity is required.' },
    },
    categoryPropertyValues: {
      type: 'object',
      nullable: true,
      patternProperties: {
        '^[a-zA-Z0-9]*$': categoryPropertyValueViewModelSchema,
      },
      required: [],
    },
  },
  required: [
    'friendlyId',
    'name',
    'description',
    'brand',
    'isNew',
    'price',
    'quantity',
  ],
};

export type ProductViewModel = {
  categories: CategoryViewModel[];
  imageUrls: string[];
} & ProductViewModelBase &
  IdModel &
  TimeStampedModel;

export const productViewModelSchema: JSONSchemaType<ProductViewModel> = {
  type: 'object',
  properties: {
    ...idModelSchema.properties,
    ...timeStampedModelSchema.properties,
    ...productViewModelBaseSchema.properties,
    categories: {
      type: 'array',
      items: categoryViewModelSchema,
    },
    imageUrls: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uri',
      },
    },
  },
  required: [
    ...idModelSchema.required,
    ...timeStampedModelSchema.required,
    ...productViewModelBaseSchema.required,
    'categories',
    'imageUrl',
  ],
  additionalProperties: false,
};

export type MutateProductViewModel = {
  categoryIds: string[];
  imageFiles?: FileList;
} & ProductViewModelBase;

export const mutateProductViewModelSchema: JSONSchemaType<MutateProductViewModel> =
  {
    type: 'object',
    properties: {
      ...productViewModelBaseSchema.properties!,
      categoryIds: {
        type: 'array',
        items: {
          type: 'string',
          minLength: 1,
          errorMessage: {
            minLength: 'Category Ids cannot be empty, null, or undefined.',
          },
        },
      },
      imageFiles: {
        type: 'object',
        nullable: true,
        required: ['item', 'length'],
      },
    },
    required: [...productViewModelBaseSchema.required, 'categoryIds'],
    additionalProperties: false,
  };

export type DeleteProductViewModel = {
  confirmationMessage: string;
};

export const deleteProductViewModelSchema: JSONSchemaType<DeleteProductViewModel> =
  {
    type: 'object',
    properties: {
      confirmationMessage: {
        type: 'string',
        const: 'permanently delete',
      },
    },
    required: ['confirmationMessage'],
  };

export type UserViewModel = {
  name: string;
  image: string;
  emailVerified: Date | null;
  roles: Extract<keyof IUserRolesEnum, string>[];
  email: string;
  defaultUserAddressId: string | null;
  addresses: UserAddressViewModel[];
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

export type ResetPasswordViewModel = {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
};

export const resetPasswordViewModelSchema: JSONSchemaType<ResetPasswordViewModel> =
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

export type CartItemViewModel = {
  product: ProductViewModel;
  quantity: number;
};

export type CheckoutViewModel = {
  cart: CartItemViewModel[];
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
};

export const mutateUserProfileViewModelSchema: JSONSchemaType<MutateUserProfileViewModel> =
  {
    type: 'object',
    properties: {
      name: { type: 'string' },
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
  PojosMetadataMap.create<ResetPasswordViewModel>('ResetPasswordViewModel', {
    email: String,
    token: String,
    password: String,
    confirmPassword: String,
  });
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
  PojosMetadataMap.create<CheckoutViewModel>('CheckoutViewModel', {
    cart: ['CartItemViewModel'],
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
    },
  );
}

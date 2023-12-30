import { ICommandRepository, IQueryRepository } from '@/lib/abstractions';
import {
  AddressDto,
  CartDto,
  CategoryDto,
  ProductDto,
  UserDto,
} from '@/models';

export interface IProductCommandRepository
  extends ICommandRepository<ProductDto> {
  removeCategoryFromAllProducts(categoryId: string): Promise<void>;
}

export interface IAddressQueryRepository extends IQueryRepository<AddressDto> {
  getExistingAddress(address: AddressDto): Promise<AddressDto | null>;
}

export interface ICategoryCommandRepository
  extends ICommandRepository<CategoryDto> {
  addChildIdToParent(parentId: string, childId: string): Promise<void>;
  removeChildIdFromParent(parentId: string, childId: string): Promise<void>;
}

export interface ICategoryQueryRepository
  extends IQueryRepository<CategoryDto> {
  getAllCategoriesWithParentId(parentId: string): Promise<CategoryDto[]>;
}

export interface IUserAddressCommandRepository
  extends ICommandRepository<UserDto> {
  setDefaultAddressForUser(
    userId: string,
    userAddressId: string | null,
  ): Promise<void>;
  addAddressAndRecipientForUser(
    userId: string,
    addressId: string,
    recipientName: string,
  ): Promise<string>;
  removeUserAddressByUserAddressId(
    userId: string,
    userAddressId: string,
  ): Promise<void>;
}

export interface IUserAddressQueryRepository extends IQueryRepository<UserDto> {
  userHasAddressAndRecipient(
    userId: string,
    addressId: string,
    recipientName: string,
  ): Promise<boolean>;
}

export interface ICartQueryRepository {
  getCart(id: string): Promise<CartDto | null>;
}

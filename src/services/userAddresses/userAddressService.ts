import {
  IAddress,
  AddressDto,
  IUserAddress,
  UserAddressDto,
  addressSchema,
} from '@/models';
import {
  IAddressQueryRepository,
  IUserAddressCommandRepository,
  IUserAddressQueryRepository,
  IUserAddressService,
} from '@/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import {
  ICommandRepository,
  IMapper,
  IProvider,
  IValidator,
} from '@/lib/abstractions';
import '@/mappingProfiles/services/userAddresses/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'userAddressService',
  'addressCommandRepository',
  'addressQueryRepository',
  'userAddressCommandRepository',
  'userAddressQueryRepository',
  'automapperProvider',
  'validator',
)
export class UserAddressService implements IUserAddressService {
  private _addressCommandRepository: ICommandRepository<IAddress>;

  private _addressQueryRepository: IAddressQueryRepository;

  private _userAddressCommandRepository: IUserAddressCommandRepository;

  private _userAddressQueryRepository: IUserAddressQueryRepository;

  private _automapperProvider: IProvider<IMapper>;

  private _validator: IValidator;

  constructor(
    addressCommandRepository: ICommandRepository<IAddress>,
    addressQueryRepository: IAddressQueryRepository,
    userAddressCommandRepository: IUserAddressCommandRepository,
    userAddressQueryRepository: IUserAddressQueryRepository,
    automapperProvider: IProvider<IMapper>,
    validator: IValidator,
  ) {
    this._addressCommandRepository = addressCommandRepository;
    this._addressQueryRepository = addressQueryRepository;
    this._userAddressCommandRepository = userAddressCommandRepository;
    this._userAddressQueryRepository = userAddressQueryRepository;
    this._automapperProvider = automapperProvider;
    this._validator = validator;
  }

  async getUserAddress(
    userId: string,
    recipientName: string,
    addressId: string,
  ): Promise<IUserAddress> {
    const user = await this._userAddressQueryRepository.getById(userId);

    if (!user) {
      throw new ErrorWithStatusCode(
        `No user found with id ${userId}.`,
        404,
        'User not found.',
      );
    }

    const userAddress = user.addresses.find(
      (a) => a.addressId === addressId && a.recipientName === recipientName,
    );

    if (!userAddress) {
      throw new ErrorWithStatusCode(
        `User does not have an address with id ${addressId} and recipient name ${recipientName}.`,
        404,
        'That address and recipient combination was not found for this user.',
      );
    }

    const address = await this._addressQueryRepository.getById(addressId);

    if (!address) {
      throw new ErrorWithStatusCode(
        `No address found with id ${addressId}.`,
        404,
        'Address not found.',
      );
    }

    return {
      _id: userAddress._id,
      recipientName: userAddress.recipientName,
      address,
    };
  }

  async getUserAddressByUserAddressId(
    userId: string,
    userAddressId: string,
  ): Promise<IUserAddress> {
    const user = await this._userAddressQueryRepository.getById(userId);

    if (!user) {
      throw new ErrorWithStatusCode(
        `No user found with id ${userId}.`,
        404,
        'User not found.',
      );
    }

    const userAddress = user.addresses.find((a) => a._id === userAddressId);

    if (!userAddress) {
      throw new ErrorWithStatusCode(
        `User does not have an address with user address id ${userAddressId}.`,
        404,
        'That user address was not found.',
      );
    }

    const addressDto = await this._addressQueryRepository.getById(
      userAddress.addressId,
    );

    if (!addressDto) {
      throw new ErrorWithStatusCode(
        `No address found with id ${userAddress.addressId}.`,
        404,
        'Address not found.',
      );
    }

    const mapper = this._automapperProvider.provide();
    const address = mapper.map<AddressDto, IAddress>(
      addressDto,
      'AddressDto',
      'IAddress',
    );

    return {
      _id: userAddress._id,
      recipientName: userAddress.recipientName,
      address,
    };
  }

  async getAllUserAddresses(userId: string): Promise<IUserAddress[]> {
    const user = await this._userAddressQueryRepository.getById(userId);

    if (!user) {
      throw new ErrorWithStatusCode(
        `No user found with id ${userId}.`,
        404,
        'User not found.',
      );
    }

    if (!user.addresses || user.addresses.length === 0) {
      return [];
    }

    const addresses = await this._addressQueryRepository.find({
      _id: { $in: user.addresses.map((a) => a.addressId) },
    });

    const result: IUserAddress[] = [];
    for (let i = 0; i < user.addresses.length; i++) {
      const { recipientName } = user.addresses[i];
      const address = addresses.find(
        (a) => a._id === user.addresses[i].addressId,
      );
      if (!address) {
        throw new ErrorWithStatusCode(
          `No address found with id ${user.addresses[i].addressId}.`,
          404,
          'Address not found.',
        );
      }
      result.push({
        _id: user.addresses[i]._id,
        recipientName,
        address: { ...address, _id: user.addresses[i].addressId },
      });
    }

    return result;
  }

  async addUserAddress(
    userId: string,
    address: IAddress,
    recipientName: string,
    setAsDefault: boolean,
  ): Promise<IUserAddress> {
    const validationResult = await this._validator.validate(
      address,
      addressSchema,
    );

    if (!validationResult.valid) {
      throw new ErrorWithStatusCode(
        `The address is invalid: ${JSON.stringify(validationResult.errors)}`,
        400,
        'The address is invalid.',
      );
    }

    let addressWithId = await this._addressQueryRepository.getExistingAddress(
      address,
    );

    if (!addressWithId) {
      const newId = await this._addressCommandRepository.create(address);
      addressWithId = { ...address, _id: newId };
    }

    if (addressWithId._id === undefined) {
      throw new ErrorWithStatusCode(
        `Address could not be retrieved from the database or created.`,
        500,
        'Address could not be added due to a server error.',
      );
    }

    const userHasAddressAndRecipient =
      await this._userAddressQueryRepository.userHasAddressAndRecipient(
        userId,
        addressWithId._id,
        recipientName,
      );

    if (userHasAddressAndRecipient) {
      throw new ErrorWithStatusCode(
        `User already has an address with id ${addressWithId._id} and recipient name ${recipientName}.`,
        400,
        'Duplicate address and recipient.',
      );
    }

    const newUserAddressId =
      await this._userAddressCommandRepository.addAddressAndRecipientForUser(
        userId,
        addressWithId._id,
        recipientName,
      );

    const user = await this._userAddressQueryRepository.getById(userId);

    if (!user) {
      throw new ErrorWithStatusCode(
        `No user found with id ${userId}.`,
        404,
        'User not found.',
      );
    }

    const userAddressDto = user.addresses.find(
      (x) => x._id === newUserAddressId,
    );

    if (!userAddressDto) {
      throw new ErrorWithStatusCode(
        `No user address found with id ${newUserAddressId}.`,
        404,
        'User address not found.',
      );
    }

    const addressDto = await this._addressQueryRepository.getById(
      userAddressDto.addressId,
    );

    if (setAsDefault) {
      await this._userAddressCommandRepository.setDefaultAddressForUser(
        userId,
        newUserAddressId,
      );
    }

    const mapper = this._automapperProvider.provide();
    const userAddress: IUserAddress = mapper.map<UserAddressDto, IUserAddress>(
      userAddressDto,
      'UserAddressDto',
      'IUserAddress',
      { extraArgs: () => ({ address: addressDto }) },
    );

    return userAddress;
  }

  async editUserAddress(
    userId: string,
    userAddressId: string,
    address: IAddress,
    recipientName: string,
    setAsDefault = false,
  ): Promise<IUserAddress> {
    const validationResult = await this._validator.validate(
      address,
      addressSchema,
    );

    if (!validationResult.valid) {
      throw new ErrorWithStatusCode(
        `The address is invalid: ${JSON.stringify(validationResult.errors)}`,
        400,
        'The address is invalid.',
      );
    }

    let addressWithId = await this._addressQueryRepository.getExistingAddress(
      address,
    );

    if (!addressWithId) {
      const newId = await this._addressCommandRepository.create(address);
      addressWithId = { ...address, _id: newId };
    }

    if (addressWithId._id === undefined) {
      throw new ErrorWithStatusCode(
        `Address could not be retrieved from the database or created.`,
        500,
        'Address could not be added due to a server error.',
      );
    }

    let newUserAddressId = userAddressId;
    const userHasAddressAndRecipient =
      await this._userAddressQueryRepository.userHasAddressAndRecipient(
        userId,
        addressWithId._id,
        recipientName,
      );

    if (!userHasAddressAndRecipient) {
      newUserAddressId =
        await this._userAddressCommandRepository.addAddressAndRecipientForUser(
          userId,
          addressWithId._id,
          recipientName,
        );

      await this._userAddressCommandRepository.removeUserAddressByUserAddressId(
        userId,
        userAddressId,
      );
    }

    if (setAsDefault) {
      await this._userAddressCommandRepository.setDefaultAddressForUser(
        userId,
        newUserAddressId,
      );
    } else {
      const user = await this._userAddressQueryRepository.getById(userId);
      if (!user) {
        throw new ErrorWithStatusCode(
          `No user found with id ${userId}.`,
          404,
          'User not found.',
        );
      }

      if (user.defaultUserAddressId === userAddressId) {
        await this._userAddressCommandRepository.setDefaultAddressForUser(
          userId,
          null,
        );
      }
    }

    const user = await this._userAddressQueryRepository.getById(userId);

    if (!user) {
      throw new ErrorWithStatusCode(
        `No user found with id ${userId}.`,
        404,
        'User not found.',
      );
    }

    const userAddressDto = user.addresses.find(
      (x) => x._id === newUserAddressId,
    );

    if (!userAddressDto) {
      throw new ErrorWithStatusCode(
        `No user address found with id ${newUserAddressId}.`,
        404,
        'User address not found.',
      );
    }

    const addressDto = await this._addressQueryRepository.getById(
      userAddressDto.addressId,
    );

    const mapper = this._automapperProvider.provide();
    const userAddress: IUserAddress = mapper.map<UserAddressDto, IUserAddress>(
      userAddressDto,
      'UserAddressDto',
      'IUserAddress',
      { extraArgs: () => ({ address: addressDto }) },
    );

    return userAddress;
  }

  async deleteUserAddress(
    userId: string,
    userAddressId: string,
  ): Promise<void> {
    await this._userAddressCommandRepository.removeUserAddressByUserAddressId(
      userId,
      userAddressId,
    );
  }
}

import { UserAddressService } from '@/services/userAddresses';
import {
  ICommandRepository,
  IMapper,
  IProvider,
  IValidator,
} from '@/lib/abstractions';
import { IAddress } from '@/models';
import {
  IAddressQueryRepository,
  IUserAddressCommandRepository,
  IUserAddressQueryRepository,
} from '@/abstractions';

describe('UserAddressService', () => {
  let service: UserAddressService;
  let addressCommandRepository: ICommandRepository<IAddress>;
  let addressQueryRepository: IAddressQueryRepository;
  let userAddressCommandRepository: IUserAddressCommandRepository;
  let userAddressQueryRepository: IUserAddressQueryRepository;
  let automapperProvider: IProvider<IMapper>;
  let validator: IValidator;
  const mapMock = jest.fn();

  beforeEach(() => {
    addressCommandRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as ICommandRepository<IAddress>;

    addressQueryRepository = {
      getById: jest.fn(),
      list: jest.fn(),
      find: jest.fn(),
      getExistingAddress: jest.fn(),
    } as unknown as IAddressQueryRepository;

    userAddressCommandRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addAddressAndRecipientForUser: jest.fn(),
      setDefaultAddressForUser: jest.fn(),
      removeUserAddressByUserAddressId: jest.fn(),
    } as unknown as IUserAddressCommandRepository;

    userAddressQueryRepository = {
      getById: jest.fn(),
      list: jest.fn(),
      find: jest.fn(),
      userHasAddressAndRecipient: jest.fn(),
    } as unknown as IUserAddressQueryRepository;

    automapperProvider = {
      provide: () => ({ map: mapMock }),
    } as unknown as IProvider<IMapper>;

    validator = {
      validate: jest.fn(),
    } as unknown as IValidator;

    service = new UserAddressService(
      addressCommandRepository,
      addressQueryRepository,
      userAddressCommandRepository,
      userAddressQueryRepository,
      automapperProvider,
      validator,
    );
  });

  describe('getUserAddress', () => {
    it('should return user address', async () => {
      const userId = '123';
      const recipientName = 'John Doe';
      const addressId = '456';

      const user = {
        _id: userId,
        addresses: [
          {
            _id: '789',
            recipientName,
            addressId,
          },
        ],
      };

      const address = {
        _id: addressId,
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      };

      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValue(user);
      (addressQueryRepository.getById as jest.Mock).mockResolvedValue(address);

      const result = await service.getUserAddress(
        userId,
        recipientName,
        addressId,
      );

      expect(result).toEqual({
        _id: user.addresses[0]._id,
        recipientName: user.addresses[0].recipientName,
        address,
      });
    });

    it('should throw error if user not found', async () => {
      const userId = '123';
      const recipientName = 'John Doe';
      const addressId = '456';

      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getUserAddress(userId, recipientName, addressId),
      ).rejects.toThrowError(`No user found with id ${userId}.`);
    });

    it('should throw error if user address not found', async () => {
      const userId = '123';
      const recipientName = 'John Doe';
      const addressId = '456';

      const user = {
        _id: userId,
        addresses: [
          {
            _id: '789',
            recipientName: 'Jane Doe',
            addressId: '789',
          },
        ],
      };

      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValue(user);

      await expect(
        service.getUserAddress(userId, recipientName, addressId),
      ).rejects.toThrowError(
        `User does not have an address with id ${addressId} and recipient name ${recipientName}.`,
      );
    });

    it('should throw error if address not found', async () => {
      const userId = '123';
      const recipientName = 'John Doe';
      const addressId = '456';

      const user = {
        _id: userId,
        addresses: [
          {
            _id: '789',
            recipientName,
            addressId,
          },
        ],
      };

      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValue(user);
      (addressQueryRepository.getById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getUserAddress(userId, recipientName, addressId),
      ).rejects.toThrowError(`No address found with id ${addressId}.`);
    });
  });

  describe('getUserAddressByUserAddressId', () => {
    it('should return user address', async () => {
      const userId = '123';
      const userAddressId = '456';

      const user = {
        _id: userId,
        addresses: [
          {
            _id: userAddressId,
            recipientName: 'John Doe',
            addressId: '789',
          },
        ],
      };

      const addressDto = {
        _id: '789',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      };

      const address = {
        _id: addressDto._id,
        street: addressDto.street,
        city: addressDto.city,
        state: addressDto.state,
        zip: addressDto.zip,
      };

      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValue(user);
      (addressQueryRepository.getById as jest.Mock).mockResolvedValue(
        addressDto,
      );
      (mapMock as jest.Mock).mockReturnValue(address);

      const result = await service.getUserAddressByUserAddressId(
        userId,
        userAddressId,
      );

      expect(result).toEqual({
        _id: user.addresses[0]._id,
        recipientName: user.addresses[0].recipientName,
        address,
      });
    });

    it('should throw error if user not found', async () => {
      const userId = '123';
      const userAddressId = '456';

      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getUserAddressByUserAddressId(userId, userAddressId),
      ).rejects.toThrowError(`No user found with id ${userId}.`);
    });

    it('should throw error if user address not found', async () => {
      const userId = '123';
      const userAddressId = '456';

      const user = {
        _id: userId,
        addresses: [
          {
            _id: '789',
            recipientName: 'John Doe',
            addressId: '789',
          },
        ],
      };

      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValue(user);

      await expect(
        service.getUserAddressByUserAddressId(userId, userAddressId),
      ).rejects.toThrowError(
        `User does not have an address with user address id ${userAddressId}.`,
      );
    });

    it('should throw error if address not found', async () => {
      const userId = '123';
      const userAddressId = '456';

      const user = {
        _id: userId,
        addresses: [
          {
            _id: userAddressId,
            recipientName: 'John Doe',
            addressId: '789',
          },
        ],
      };

      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValue(user);
      (addressQueryRepository.getById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getUserAddressByUserAddressId(userId, userAddressId),
      ).rejects.toThrowError(
        `No address found with id ${user.addresses[0].addressId}.`,
      );
    });
  });

  describe('getAllUserAddresses', () => {
    it('should return an empty array if the user has no addresses', async () => {
      const user = { addresses: [] };
      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(
        user,
      );

      const result = await service.getAllUserAddresses('123');

      expect(result).toEqual([]);
    });

    it('should return an array of UserAddress objects if the user has addresses', async () => {
      const user = {
        addresses: [
          { _id: 'abc', addressId: '456', recipientName: 'John Doe' },
          { _id: 'xyz', addressId: '789', recipientName: 'Jane Doe' },
        ],
      };
      const addresses = [
        { _id: '456', street: '123 Main St', city: 'Anytown', state: 'CA' },
        { _id: '789', street: '456 Elm St', city: 'Othertown', state: 'NY' },
      ];
      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(
        user,
      );
      (addressQueryRepository.find as jest.Mock).mockResolvedValueOnce(
        addresses,
      );

      const result = await service.getAllUserAddresses('123');

      expect(result).toEqual([
        {
          _id: expect.any(String),
          recipientName: 'John Doe',
          address: {
            _id: '456',
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
          },
        },
        {
          _id: expect.any(String),
          recipientName: 'Jane Doe',
          address: {
            _id: '789',
            street: '456 Elm St',
            city: 'Othertown',
            state: 'NY',
          },
        },
      ]);
    });

    it('should throw an error if the user is not found', async () => {
      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(
        null,
      );

      await expect(service.getAllUserAddresses('123')).rejects.toThrow(
        'No user found with id 123.',
      );
    });

    it('should throw an error if an address is not found', async () => {
      const user = {
        addresses: [{ addressId: '456', recipientName: 'John Doe' }],
      };
      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(
        user,
      );
      (addressQueryRepository.find as jest.Mock).mockResolvedValueOnce([]);

      await expect(service.getAllUserAddresses('123')).rejects.toThrow(
        'No address found with id 456.',
      );
    });
  });

  describe('addUserAddress', () => {
    it('should add an address to the user', async () => {
      const userAddress = {
        _id: 'xyz',
        recipientName: 'John Doe',
        addressId: '456',
      };
      const user = { _id: '123', addresses: [userAddress] };
      const address = {
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        country: 'US',
        postalCode: '12345',
      };

      (validator.validate as jest.Mock).mockReturnValueOnce({
        valid: true,
      });
      (userAddressCommandRepository.create as jest.Mock).mockResolvedValueOnce({
        _id: '789',
      });
      (addressCommandRepository.create as jest.Mock).mockResolvedValueOnce(
        '456',
      );
      (addressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(null);
      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(
        user,
      );
      (userAddressQueryRepository.find as jest.Mock).mockResolvedValueOnce([
        userAddress,
      ]);
      (
        userAddressCommandRepository.addAddressAndRecipientForUser as jest.Mock
      ).mockResolvedValueOnce('xyz');
      (mapMock as jest.Mock).mockReturnValueOnce({
        _id: '789',
        recipientName: 'John Doe',
        address,
      });

      const result = await service.addUserAddress(
        '123',
        address,
        'John Doe',
        true,
      );

      expect(
        userAddressCommandRepository.addAddressAndRecipientForUser,
      ).toHaveBeenCalledWith('123', '456', 'John Doe');
      expect(result).toMatchObject({
        _id: '789',
        recipientName: 'John Doe',
        address,
      });
    });

    it('should throw an error if the address is invalid', async () => {
      const address = {
        _id: '456',
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        country: 'US',
        postalCode: '12345',
      };
      (validator.validate as jest.Mock).mockReturnValueOnce({
        valid: false,
        errors: { lineOne: 'Line one is required.' },
      });

      await expect(
        service.addUserAddress('123', address, 'John Doe', false),
      ).rejects.toThrow(
        'The address is invalid: {"lineOne":"Line one is required."}',
      );
    });

    it('should throw an error if the user is not found', async () => {
      const address = {
        _id: '456',
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        country: 'US',
        postalCode: '12345',
      };
      const userAddress = {
        _id: '789',
        recipientName: 'John Doe',
        addressId: '456',
      };
      (validator.validate as jest.Mock).mockReturnValueOnce({
        valid: true,
      });
      (userAddressCommandRepository.create as jest.Mock).mockResolvedValueOnce({
        _id: '789',
      });
      (
        addressQueryRepository.getExistingAddress as jest.Mock
      ).mockResolvedValueOnce(address);
      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(
        null,
      );
      (
        userAddressQueryRepository.userHasAddressAndRecipient as jest.Mock
      ).mockResolvedValueOnce(false);

      await expect(
        service.addUserAddress('123', address, 'John Doe', false),
      ).rejects.toThrow('No user found with id 123.');
    });

    it('should throw an error if the address is not found', async () => {
      const user = { _id: '123', addresses: [] };
      const address = {
        _id: '456',
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        country: 'US',
        postalCode: '12345',
      };
      (validator.validate as jest.Mock).mockReturnValueOnce({
        valid: true,
      });
      (userAddressCommandRepository.create as jest.Mock).mockResolvedValueOnce({
        _id: '789',
      });
      (addressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        service.addUserAddress('123', address, 'John Doe', false),
      ).rejects.toThrow(
        'Address could not be retrieved from the database or created.',
      );
    });
  });

  describe('editUserAddress', () => {
    it('should update the recipient name of the user address', async () => {
      const userAddress = {
        _id: '123',
        addressId: '789',
        recipientName: 'John Doe',
      };
      const address = {
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
      };
      const addressWithId = {
        _id: '789',
        ...address,
      };
      const user = {
        _id: 'xyz',
        addresses: [userAddress],
      };
      (
        userAddressCommandRepository.addAddressAndRecipientForUser as jest.Mock
      ).mockResolvedValueOnce('123');
      (addressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(
        addressWithId,
      );
      (
        addressQueryRepository.getExistingAddress as jest.Mock
      ).mockResolvedValueOnce(addressWithId);
      (validator.validate as jest.Mock).mockReturnValueOnce({
        valid: true,
      });
      (userAddressQueryRepository.getById as jest.Mock).mockResolvedValue(user);
      (
        userAddressQueryRepository.userHasAddressAndRecipient as jest.Mock
      ).mockResolvedValueOnce(false);
      (mapMock as jest.Mock).mockReturnValueOnce({
        _id: '123',
        recipientName: 'Jane Doe',
        address: addressWithId,
      });

      const result = await service.editUserAddress(
        'xyz',
        '123',
        address,
        'Jane Doe',
      );

      expect(
        userAddressCommandRepository.addAddressAndRecipientForUser,
      ).toHaveBeenCalledWith('xyz', '789', 'Jane Doe');
      expect(result).toEqual({
        _id: '123',
        recipientName: 'Jane Doe',
        address: addressWithId,
      });
    });

    it('should throw an error if the user is not found', async () => {
      const address = {
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
      };
      const addressWithId = {
        _id: '789',
        ...address,
      };
      (userAddressCommandRepository.update as jest.Mock).mockResolvedValueOnce(
        null,
      );
      (validator.validate as jest.Mock).mockReturnValueOnce({
        valid: true,
      });
      (
        addressQueryRepository.getExistingAddress as jest.Mock
      ).mockResolvedValueOnce(addressWithId);

      await expect(
        service.editUserAddress('xyz', '123', address, 'Jane Doe'),
      ).rejects.toThrow('No user found with id xyz.');
    });

    it('should throw an error if the address is not found', async () => {
      const userAddress = {
        _id: '123',
        userId: '456',
        addressId: '789',
        recipientName: 'John Doe',
      };
      const address = {
        _id: '789',
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
      };
      (userAddressCommandRepository.update as jest.Mock).mockResolvedValueOnce(
        userAddress,
      );
      (addressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(null);
      (validator.validate as jest.Mock).mockReturnValueOnce({
        valid: true,
      });

      await expect(
        service.editUserAddress('xyz', '123', address, 'Jane Doe'),
      ).rejects.toThrow(
        'Address could not be retrieved from the database or created.',
      );
    });

    it('should throw an error if the address is invalid', async () => {
      const userAddress = {
        _id: '123',
        userId: '456',
        addressId: '789',
        recipientName: 'John Doe',
      };
      const address = {
        _id: '789',
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
      };
      (validator.validate as jest.Mock).mockReturnValueOnce({
        valid: false,
        errors: { lineOne: 'Line one is required.' },
      });
      (userAddressCommandRepository.update as jest.Mock).mockResolvedValueOnce(
        userAddress,
      );
      (addressQueryRepository.getById as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        service.editUserAddress('xyz', '123', address, 'Jane Doe'),
      ).rejects.toThrow(
        'The address is invalid: {"lineOne":"Line one is required."}',
      );
    });
  });

  describe('deleteUserAddress', () => {
    it('should delete the user address', async () => {
      const userAddress = {
        _id: '123',
        userId: '456',
        addressId: '789',
        recipientName: 'John Doe',
      };
      (
        userAddressCommandRepository.removeUserAddressByUserAddressId as jest.Mock
      ).mockResolvedValueOnce(userAddress);

      const result = await service.deleteUserAddress('456', '123');

      expect(
        userAddressCommandRepository.removeUserAddressByUserAddressId,
      ).toHaveBeenCalledWith('456', '123');
    });
  });
});

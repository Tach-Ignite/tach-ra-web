import bcrypt from 'bcryptjs';
import {
  ICommandRepository,
  IEmailService,
  IFactory,
  IIdOmitter,
  IMapper,
  IProvider,
  IQueryRepository,
  ITokenService,
  IValidator,
  IdModel,
} from '@/lib/abstractions';
import { UserService } from '@/services/users';
import {
  AccountDto,
  IUser,
  IUserAddress,
  UserDto,
  UserRolesEnum,
} from '@/models';
import { IUserAddressService, IProductService } from '@/abstractions';

describe('UserService', () => {
  let service: UserService;
  let userCommandRepository: jest.Mocked<ICommandRepository<UserDto>>;
  let userQueryRepository: jest.Mocked<IQueryRepository<UserDto>>;
  let accountCommandRepository: jest.Mocked<ICommandRepository<AccountDto>>;
  let accountQueryRepository: jest.Mocked<IQueryRepository<AccountDto>>;
  let userAddressService: jest.Mocked<IUserAddressService>;
  let productService: jest.Mocked<IProductService>;
  let emailServiceFactory: IFactory<jest.Mocked<IEmailService>>;
  let emailService: jest.Mocked<IEmailService>;
  let tokenService: jest.Mocked<ITokenService>;
  let idOmitter: jest.Mocked<IIdOmitter>;
  let tachEmailSource: string;
  let nextPublicBaseUrl: string;

  let automapperProvider: IProvider<IMapper>;
  let validator: IValidator;
  let mapMock = jest.fn();
  let mapArrayMock = jest.fn();

  beforeEach(() => {
    mapMock = jest.fn();
    mapArrayMock = jest.fn();
    userCommandRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
    };
    userQueryRepository = {
      getById: jest.fn(),
      list: jest.fn(),
      find: jest.fn(),
    };
    accountCommandRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
    };
    accountQueryRepository = {
      getById: jest.fn(),
      list: jest.fn(),
      find: jest.fn(),
    };
    userAddressService = {
      getUserAddress: jest.fn(),
      getUserAddressByUserAddressId: jest.fn(),
      getAllUserAddresses: jest.fn(),
      addUserAddress: jest.fn(),
      editUserAddress: jest.fn(),
      deleteUserAddress: jest.fn(),
    };
    productService = {
      getProductById: jest.fn(),
      getProductsByIds: jest.fn(),
      getAllProducts: jest.fn(),
      createProduct: jest.fn(),
      editProduct: jest.fn(),
      deleteProduct: jest.fn(),
      searchProducts: jest.fn(),
    };

    automapperProvider = {
      provide: () => ({ map: mapMock, mapArray: mapArrayMock }),
    } as unknown as IProvider<IMapper>;
    emailService = { sendEmail: jest.fn() };
    emailServiceFactory = {
      create: () => {
        return emailService;
      },
    };
    tokenService = {
      createToken: jest.fn(),
      validateToken: jest.fn(),
    };
    idOmitter = {
      omitId: jest.fn(),
    };
    tachEmailSource = 'test@test.com';
    nextPublicBaseUrl = 'http://www.test.com';

    jest.mock('bcryptjs');

    service = new UserService(
      userQueryRepository,
      userCommandRepository,
      accountQueryRepository,
      accountCommandRepository,
      userAddressService,
      productService,
      automapperProvider,
      emailServiceFactory,
      tokenService,
      idOmitter,
      tachEmailSource,
      nextPublicBaseUrl,
    );
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      // Arrange
      const userId = '123';
      const accountId = 'acc123';
      const recipientName = 'John Doe';
      const addressId = '456';
      const user: IUser = {
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        cart: { items: [] },
      };
      const userDto: UserDto = {
        _id: userId,
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userDtoWithId: UserDto & IdModel = {
        ...userDto,
        _id: userId,
      };
      const userDtoWithoutId: UserDto = {
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userWithId: IUser = {
        ...user,
        _id: userId,
      };
      const password = 'password123';
      const token = 'someToken';
      const emailService = emailServiceFactory.create();
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
      mapMock.mockReturnValueOnce(userDtoWithoutId);
      userCommandRepository.create.mockResolvedValueOnce(userId);
      accountCommandRepository.create.mockResolvedValueOnce(accountId);
      tokenService.createToken.mockResolvedValueOnce(token);
      userQueryRepository.getById.mockResolvedValueOnce(userDtoWithId);
      idOmitter.omitId.mockReturnValueOnce(userDtoWithoutId);
      mapMock.mockReturnValueOnce(userWithId);

      // Act
      const createdUser = await service.createUser(user, password);

      // Assert
      expect(createdUser).toBeDefined();
      expect(createdUser).toBe(userWithId);
      expect(bcrypt.hash).toBeCalledTimes(1);
      expect(bcrypt.hash).toBeCalledWith(password, 10);
      expect(mapMock).toBeCalledTimes(2);
      expect(userCommandRepository.create).toBeCalledTimes(1);
      expect(userCommandRepository.create).toBeCalledWith(userDtoWithoutId);
      expect(accountCommandRepository.create).toBeCalledTimes(1);
      expect(accountCommandRepository.create).toBeCalledWith({
        userId,
        provider: 'credentials',
        providerAccountId: userId,
        type: 'credentials',
      });
      expect(tokenService.createToken).toBeCalledTimes(1);
      expect(tokenService.createToken).toBeCalledWith(
        userId,
        user.email,
        '14d',
      );
      expect(userQueryRepository.getById).toBeCalledTimes(1);
      expect(userQueryRepository.getById).toBeCalledWith(userId);
      expect(idOmitter.omitId).toBeCalledTimes(1);
      expect(idOmitter.omitId).toBeCalledWith(userDtoWithId);
      expect(idOmitter.omitId).toBeCalledWith(
        expect.objectContaining({ token }),
      );
      expect(userCommandRepository.update).toBeCalledTimes(1);
      expect(userCommandRepository.update).toBeCalledWith(
        userId,
        userDtoWithoutId,
      );
      expect(emailService.sendEmail).toBeCalledTimes(1);
      expect(emailService.sendEmail).toBeCalledWith(
        tachEmailSource,
        user.email,
        '[Action Required] Welcome to Tach Color Store!',
        `Please verify your email address by clicking this link: <a href="${nextPublicBaseUrl}/auth/verifyEmail?token=${token}" target="_blank">Verify Email</a>`,
      );
    });
  });

  describe('resendEmailAddressVerification', () => {
    it('should resend email address verification', async () => {
      const token = 'someToken';
      const createdToken = 'someNewToken';
      const userId = 'abc123';
      const userDto: UserDto = {
        _id: userId,
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userDtoWithId: UserDto & IdModel = {
        ...userDto,
        _id: userId,
      };
      const emailService = emailServiceFactory.create();

      userQueryRepository.find.mockResolvedValueOnce([userDtoWithId]);
      tokenService.createToken.mockResolvedValueOnce(createdToken);

      await service.resendEmailAddressVerification(token);

      expect(userQueryRepository.find).toBeCalledTimes(1);
      expect(userQueryRepository.find).toBeCalledWith(
        expect.objectContaining({ token }),
      );
      expect(tokenService.createToken).toBeCalledTimes(1);
      expect(tokenService.createToken).toBeCalledWith(
        userId,
        userDto.email,
        '14d',
      );
      expect(userCommandRepository.update).toBeCalledTimes(1);
      expect(userCommandRepository.update).toBeCalledWith(
        userId,
        expect.objectContaining({ token: createdToken }),
      );
      expect(emailService.sendEmail).toBeCalledTimes(1);
      expect(emailService.sendEmail).toBeCalledWith(
        tachEmailSource,
        userDto.email,
        '[Action Required] Welcome to Tach Color Store!',
        `Please verify your email address by clicking this link: <a href="${nextPublicBaseUrl}/auth/verifyEmail?token=${createdToken}" target="_blank">Verify Email</a>`,
      );
    });
  });

  describe('sendPasswordResetRequest', () => {
    it('should send password reset request', async () => {
      const userId = 'abc1123';
      const accountId = 'acc123';
      const email = 'jdoe@test.com';
      const token = 'someToken';
      const userDto: UserDto = {
        _id: userId,
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userDtoWithId: UserDto & IdModel = {
        ...userDto,
        _id: userId,
      };
      const accountDto: AccountDto & IdModel = {
        _id: accountId,
        userId,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: userId,
      };
      const emailService = emailServiceFactory.create();

      userQueryRepository.find.mockResolvedValueOnce([userDtoWithId]);
      accountQueryRepository.find.mockResolvedValueOnce([accountDto]);
      tokenService.createToken.mockResolvedValueOnce(token);

      await service.sendPasswordResetRequest(email);

      expect(userQueryRepository.find).toBeCalledTimes(1);
      expect(userQueryRepository.find).toBeCalledWith(
        expect.objectContaining({ email }),
      );
      expect(accountQueryRepository.find).toBeCalledTimes(1);
      expect(accountQueryRepository.find).toBeCalledWith(
        expect.objectContaining({ userId }),
      );
      expect(tokenService.createToken).toBeCalledTimes(1);
      expect(tokenService.createToken).toBeCalledWith(
        userId,
        userDto.email,
        '30m',
      );
      expect(userCommandRepository.update).toBeCalledTimes(1);
      expect(userCommandRepository.update).toBeCalledWith(
        userId,
        expect.objectContaining({ passwordResetToken: token }),
      );
      expect(emailService.sendEmail).toBeCalledTimes(1);
      expect(emailService.sendEmail).toBeCalledWith(
        tachEmailSource,
        userDto.email,
        '[Action Required] Tach Color Store password reset request',
        `A request was made to reset the password for the account associated with this email. If you did not make this request, please disregard this email. This link expires after 30 minutes. <a href="${nextPublicBaseUrl}/auth/resetPassword/verify?passwordResetToken=${token}&email=${encodeURIComponent(
          email,
        )}" target="_blank">Reset Password</a>`,
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const userId = 'abc1123';
      const accountId = 'acc123';
      const email = 'jdoe@test.com';
      const token = 'someToken';
      const password = 'newPassword';
      const userDto: UserDto = {
        _id: userId,
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userDtoWithId: UserDto & IdModel = {
        ...userDto,
        _id: userId,
      };
      const accountDto: AccountDto & IdModel = {
        _id: accountId,
        userId,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: userId,
      };
      const emailService = emailServiceFactory.create();

      userQueryRepository.find.mockResolvedValueOnce([userDtoWithId]);
      accountQueryRepository.find.mockResolvedValueOnce([accountDto]);
      tokenService.validateToken.mockResolvedValueOnce(true);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

      await service.unauthenticatedResetPassword(
        email,
        token,
        password,
        password,
      );

      expect(userQueryRepository.find).toBeCalledTimes(1);
      expect(userQueryRepository.find).toBeCalledWith(
        expect.objectContaining({ email }),
      );
      expect(accountQueryRepository.find).toBeCalledTimes(1);
      expect(accountQueryRepository.find).toBeCalledWith(
        expect.objectContaining({ userId }),
      );
      expect(tokenService.validateToken).toBeCalledTimes(1);
      expect(tokenService.validateToken).toBeCalledWith(token, email);
      expect(bcrypt.hash).toBeCalledTimes(1);
      expect(bcrypt.hash).toBeCalledWith(password, 10);
      expect(userCommandRepository.update).toBeCalledTimes(1);
      expect(userCommandRepository.update).toBeCalledWith(
        userId,
        expect.objectContaining({ password: 'hashedPassword' }),
      );
      expect(emailService.sendEmail).toBeCalledTimes(1);
      expect(emailService.sendEmail).toBeCalledWith(
        tachEmailSource,
        userDto.email,
        'Tach Color Store password reset successful',
        `Your password has been successfully reset. You can now login with your new password.`,
      );
    });
  });

  describe('verifyEmailAddress', () => {
    it('should verify email address', async () => {
      const userId = 'abc1123';
      const accountId = 'acc123';
      const email = 'jdoe@test.com';
      const token = 'someToken';
      const userDto: UserDto = {
        _id: userId,
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userDtoWithId: UserDto & IdModel = {
        ...userDto,
        _id: userId,
      };

      userQueryRepository.find.mockResolvedValueOnce([userDtoWithId]);
      tokenService.validateToken.mockResolvedValueOnce(true);

      await service.verifyEmailAddress(token);

      expect(userQueryRepository.find).toBeCalledTimes(1);
      expect(userQueryRepository.find).toBeCalledWith(
        expect.objectContaining({ token }),
      );
      expect(tokenService.validateToken).toBeCalledTimes(1);
      expect(tokenService.validateToken).toBeCalledWith(token, email);
      expect(userCommandRepository.update).toBeCalledTimes(1);
      expect(userCommandRepository.update).toBeCalledWith(
        userId,
        expect.objectContaining({ emailVerified: expect.any(Date) }),
      );
    });
  });

  describe('setUserRoles', () => {
    it('should set user roles', async () => {
      const userId = 'abc1123';
      const roles = [
        UserRolesEnum.reverseLookup(UserRolesEnum.Admin),
        UserRolesEnum.reverseLookup(UserRolesEnum.SomeOtherRole),
      ];
      const userDto: UserDto = {
        _id: userId,
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userDtoWithId: UserDto & IdModel = {
        ...userDto,
        _id: userId,
      };
      const user: IUser = {
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        cart: { items: [] },
      };
      const userWithId: IUser = {
        ...user,
        _id: userId,
      };

      userQueryRepository.getById.mockResolvedValueOnce(userDtoWithId);
      service.getUserById = jest.fn().mockResolvedValueOnce(userWithId);

      const result = await service.setUserRoles(userId, roles);

      expect(result).toBe(userWithId);
      expect(userQueryRepository.getById).toBeCalledTimes(1);
      expect(userQueryRepository.getById).toBeCalledWith(userId);
      expect(userCommandRepository.update).toBeCalledTimes(1);
      expect(userCommandRepository.update).toBeCalledWith(
        userId,
        expect.objectContaining({ roles }),
      );
      expect(service.getUserById).toBeCalledTimes(1);
      expect(service.getUserById).toBeCalledWith(userId);
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const userId = 'abc1123';
      const userAddressId1 = 'userAddressId1';
      const userAddressId2 = 'userAddressId2';
      const roles = [
        UserRolesEnum.reverseLookup(UserRolesEnum.Admin),
        UserRolesEnum.reverseLookup(UserRolesEnum.SomeOtherRole),
      ];
      const userDto: UserDto = {
        _id: userId,
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userDtoWithId: UserDto & IdModel = {
        ...userDto,
        _id: userId,
      };
      const addressDto1 = {
        _id: '789',
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
      };

      const address1 = {
        _id: addressDto1._id,
        lineOne: addressDto1.lineOne,
        city: addressDto1.city,
        state: addressDto1.state,
        postalCode: addressDto1.postalCode,
        country: 'US',
      };

      const addressDto2 = {
        _id: '234',
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
      };

      const address2 = {
        _id: addressDto2._id,
        lineOne: addressDto2.lineOne,
        city: addressDto2.city,
        state: addressDto2.state,
        postalCode: addressDto2.postalCode,
        country: 'US',
      };

      const userAddresses: IUserAddress[] = [
        {
          _id: userAddressId1,
          recipientName: 'John Doe',
          address: address1,
        },
        {
          _id: userAddressId2,
          recipientName: 'Jane Doe',
          address: address2,
        },
      ];

      const user: IUser = {
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: userAddresses,
        cart: { items: [] },
      };
      const userWithId: IUser = {
        ...user,
        _id: userId,
      };

      userQueryRepository.getById.mockResolvedValueOnce(userDtoWithId);
      userAddressService.getAllUserAddresses.mockResolvedValueOnce(
        userAddresses,
      );
      mapMock.mockReturnValueOnce(userWithId);

      const result = await service.getUserById(userId);

      expect(result).toBe(userWithId);
      expect(userQueryRepository.getById).toBeCalledTimes(1);
      expect(userQueryRepository.getById).toBeCalledWith(userId);
      expect(userAddressService.getAllUserAddresses).toBeCalledTimes(1);
      expect(userAddressService.getAllUserAddresses).toBeCalledWith(userId);
      expect(mapMock).toBeCalledTimes(1);
    });
  });

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      const userId = 'abc1123';
      const userId2 = 'abc1124';
      const userAddressId1 = 'userAddressId1';
      const userAddressId2 = 'userAddressId2';
      const roles = [
        UserRolesEnum.reverseLookup(UserRolesEnum.Admin),
        UserRolesEnum.reverseLookup(UserRolesEnum.SomeOtherRole),
      ];
      const userDto: UserDto = {
        _id: userId,
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userDtoWithId: UserDto & IdModel = {
        ...userDto,
        _id: userId,
      };
      const userDto2: UserDto = {
        _id: userId2,
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: [],
        password: 'hashedPassword',
        emailVerified: undefined,
        cart: { items: [] },
      };
      const userDtoWithId2: UserDto & IdModel = {
        ...userDto,
        _id: userId2,
      };
      const addressDto1 = {
        _id: '789',
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
      };

      const address1 = {
        _id: addressDto1._id,
        lineOne: addressDto1.lineOne,
        city: addressDto1.city,
        state: addressDto1.state,
        postalCode: addressDto1.postalCode,
        country: 'US',
      };

      const addressDto2 = {
        _id: '234',
        lineOne: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
      };

      const address2 = {
        _id: addressDto2._id,
        lineOne: addressDto2.lineOne,
        city: addressDto2.city,
        state: addressDto2.state,
        postalCode: addressDto2.postalCode,
        country: 'US',
      };

      const userAddresses: IUserAddress[] = [
        {
          _id: userAddressId1,
          recipientName: 'John Doe',
          address: address1,
        },
        {
          _id: userAddressId2,
          recipientName: 'Jane Doe',
          address: address2,
        },
      ];

      const userAddresses2: IUserAddress[] = [
        {
          _id: userAddressId1,
          recipientName: 'John Doe',
          address: address1,
        },
        {
          _id: userAddressId2,
          recipientName: 'Jane Doe',
          address: address2,
        },
      ];

      const user2: IUser = {
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: userAddresses,
        cart: { items: [] },
      };
      const userWithId2: IUser = {
        ...user2,
        _id: userId2,
      };
      const user: IUser = {
        name: 'John Doe',
        email: 'jdoe@test.com',
        roles: [],
        addresses: userAddresses,
        cart: { items: [] },
      };
      const userWithId: IUser = {
        ...user,
        _id: userId,
      };
      const usersWithId = [userWithId];
      const userDtosWithId = [userDtoWithId, userDtoWithId2];

      userQueryRepository.list.mockResolvedValueOnce(userDtosWithId);
      userAddressService.getAllUserAddresses.mockResolvedValueOnce(
        userAddresses,
      );
      userAddressService.getAllUserAddresses.mockResolvedValueOnce(
        userAddresses2,
      );
      mapMock.mockReturnValueOnce(userWithId);
      mapMock.mockReturnValueOnce(userWithId2);

      const result = await service.getAllUsers();

      expect(result).toEqual(expect.arrayContaining([userWithId, userWithId2]));
      expect(userQueryRepository.list).toBeCalledTimes(1);
      expect(userAddressService.getAllUserAddresses).toBeCalledTimes(2);
      expect(userAddressService.getAllUserAddresses).toHaveBeenNthCalledWith(
        1,
        userId,
      );
      expect(userAddressService.getAllUserAddresses).toHaveBeenNthCalledWith(
        2,
        userId2,
      );
      expect(mapMock).toBeCalledTimes(2);
    });
  });
});

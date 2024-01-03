import bcrypt from 'bcryptjs';
import {
  IProductService,
  IUserAddressService,
  IUserService,
} from '@/abstractions';
import {
  ICommandRepository,
  IEmailService,
  IFactory,
  IIdOmitter,
  IMapper,
  IProvider,
  IQueryRepository,
  ITokenService,
} from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import {
  AccountDto,
  IUser,
  IUserAddress,
  IUserRolesEnum,
  UserDto,
} from '@/models';

import '@/mappingProfiles/services/users/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';
import { DeleteUserAddressCommand } from '@/commands/userAddresses';

@Injectable(
  'userService',
  'userQueryRepository',
  'userCommandRepository',
  'accountQueryRepository',
  'accountCommandRepository',
  'userAddressService',
  'productService',
  'automapperProvider',
  'emailServiceFactory',
  'tokenService',
  'idOmitter',
  'tachEmailSource',
  'nextPublicBaseUrl',
)
export class UserService implements IUserService {
  private _userQueryRepository: IQueryRepository<UserDto>;

  private _userCommandRepository: ICommandRepository<UserDto>;

  private _accountQueryRepository: IQueryRepository<AccountDto>;

  private _accountCommandRepository: ICommandRepository<AccountDto>;

  private _userAddressService: IUserAddressService;

  private _productService: IProductService;

  private _automapperProvider: IProvider<IMapper>;

  private _emailService: IEmailService;

  private _tokenService: ITokenService;

  private _idOmitter: IIdOmitter;

  private _fromEmail: string;

  private _baseUrl: string;

  constructor(
    userQueryRepository: IQueryRepository<UserDto>,
    userCommandRepository: ICommandRepository<UserDto>,
    accountQueryRepository: IQueryRepository<AccountDto>,
    accountCommandRepository: ICommandRepository<AccountDto>,
    userAddressService: IUserAddressService,
    productService: IProductService,
    automapperProvider: IProvider<IMapper>,
    emailServiceFactory: IFactory<IEmailService>,
    tokenService: ITokenService,
    idOmitter: IIdOmitter,
    tachEmailSource: string,
    nextPublicBaseUrl: string,
  ) {
    this._fromEmail = tachEmailSource;
    this._baseUrl = nextPublicBaseUrl;
    this._userQueryRepository = userQueryRepository;
    this._userCommandRepository = userCommandRepository;
    this._accountQueryRepository = accountQueryRepository;
    this._accountCommandRepository = accountCommandRepository;
    this._userAddressService = userAddressService;
    this._productService = productService;
    this._automapperProvider = automapperProvider;
    this._emailService = emailServiceFactory.create();
    this._tokenService = tokenService;
    this._idOmitter = idOmitter;
  }

  async createUser(user: IUser, password: string): Promise<IUser> {
    const existingUser = await this._userQueryRepository.find({
      email: user.email,
    });

    if (existingUser.length > 0) {
      throw new ErrorWithStatusCode(
        `A user with email '${user.email}' already exists.`,
        400,
        'Bad request.',
      );
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const mapper = this._automapperProvider.provide();
    const userDto = mapper.map<IUser, UserDto>(user, 'IUser', 'UserDto', {
      extraArgs: () => ({ password: encryptedPassword }),
    });

    const createdUserId = await this._userCommandRepository.create(userDto);

    if (!createdUserId) {
      throw new ErrorWithStatusCode(
        'Unable to create user.',
        500,
        'There is an issue with the server. Please try again later.',
      );
    }

    const createdAccountId = await this._accountCommandRepository.create({
      userId: createdUserId,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: createdUserId,
    });

    if (!createdAccountId) {
      throw new ErrorWithStatusCode(
        `Unable to create user account with user id '${createdUserId}'.`,
        500,
        'There is an issue with the server. Please try again later.',
      );
    }

    const token = await this._tokenService.createToken(
      createdUserId,
      user.email,
      '14d',
    );

    let createdUser = (await this._userQueryRepository.getById(
      createdUserId,
    )) as UserDto;

    createdUser.token = token;
    createdUser = this._idOmitter.omitId(createdUser);

    await this._userCommandRepository.update(createdUserId, createdUser);

    await this._emailService.sendEmail(
      this._fromEmail,
      user.email,
      '[Action Required] Welcome to Tach Color Store!',
      `Please verify your email address by clicking this link: <a href="${this._baseUrl}/auth/verifyEmail?token=${token}" target="_blank">Verify Email</a>`,
    );

    return mapper.map<UserDto, IUser>(createdUser, 'UserDto', 'IUser');
  }

  async editUser(userId: string, user: Partial<IUser>): Promise<IUser> {
    user = this._idOmitter.omitId(user);
    const mapper = this._automapperProvider.provide();
    let userDto = mapper.map<Partial<IUser>, Partial<UserDto>>(
      user,
      'IUser',
      'UserDto',
    );

    // TODO: Better to do a proper merge, otherwise properties will be lost.
    userDto = JSON.parse(JSON.stringify(userDto));

    await this._userCommandRepository.update(userId, userDto);

    const updatedUser = await this.getUserById(userId);

    if (!updatedUser) {
      throw new ErrorWithStatusCode(
        `Unable to update user with id '${user._id}'.`,
        500,
        'There is an issue with the server. Please try again later.',
      );
    }

    return updatedUser;
  }

  async resendEmailAddressVerification(token: string): Promise<void> {
    const users = await this._userQueryRepository.find({
      token,
    });

    if (users.length === 0) {
      throw new ErrorWithStatusCode(
        'The provided token was not found.',
        400,
        'Bad request.',
      );
    }

    const user = users[0];

    const newToken = await this._tokenService.createToken(
      user._id,
      user.email,
      '14d',
    );

    await this._userCommandRepository.update(user._id, { token: newToken });

    await this._emailService.sendEmail(
      this._fromEmail,
      user.email,
      '[Action Required] Welcome to Tach Color Store!',
      `Please verify your email address by clicking this link: <a href="${this._baseUrl}/auth/verifyEmail?token=${newToken}" target="_blank">Verify Email</a>`,
    );
  }

  async sendPasswordResetRequest(email: string): Promise<void> {
    const users = await this._userQueryRepository.find({ email });

    if (users.length === 0) {
      throw new ErrorWithStatusCode(
        'The provided email was not found.',
        400,
        'Bad request.',
      );
    }

    const user = users[0];

    const accounts = await this._accountQueryRepository.find({
      userId: user._id,
    });

    if (accounts.length === 0) {
      throw new ErrorWithStatusCode(
        `The user account for user id '${user._id}' was not found.`,
        500,
        'There was an error on the server. Please try again later.',
      );
    }

    const account = accounts[0];

    if (account.provider !== 'credentials') {
      throw new ErrorWithStatusCode(
        'The provided email is associated with an account managed with a third-party OAuth Provider; there is no password to reset.',
        400,
        'Bad request.',
      );
    }

    const token = await this._tokenService.createToken(
      user._id,
      user.email,
      '30m',
    );

    await this._userCommandRepository.update(user._id, {
      passwordResetToken: token,
    });

    await this._emailService.sendEmail(
      this._fromEmail,
      user.email,
      '[Action Required] Tach Color Store password reset request',
      `A request was made to reset the password for the account associated with this email. If you did not make this request, please disregard this email. This link expires after 30 minutes. <a href="${
        this._baseUrl
      }/auth/resetPassword/verify?passwordResetToken=${token}&email=${encodeURIComponent(
        email,
      )}" target="_blank">Reset Password</a>`,
    );
  }

  async unauthenticatedResetPassword(
    email: string,
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    const users = await this._userQueryRepository.find({ email });

    if (users.length === 0) {
      throw new ErrorWithStatusCode(
        'The provided email was not found.',
        400,
        'Bad request.',
      );
    }

    const user = users[0];

    const accounts = await this._accountQueryRepository.find({
      userId: user._id,
    });

    if (accounts.length === 0) {
      throw new ErrorWithStatusCode(
        `The user account for user id '${user._id}' was not found.`,
        500,
        'There was an error on the server. Please try again later.',
      );
    }

    const account = accounts[0];

    if (account.provider !== 'credentials') {
      throw new ErrorWithStatusCode(
        'The provided email is associated with an account managed with a third-party OAuth Provider; there is no password to reset.',
        400,
        'Bad request.',
      );
    }

    const isValid = await this._tokenService.validateToken(token, email);

    if (!isValid) {
      throw new ErrorWithStatusCode('Token is invalid.', 400);
    }

    if (password !== confirmPassword) {
      throw new ErrorWithStatusCode('Passwords do not match.', 400);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await this._userCommandRepository.update(user._id, {
      password: encryptedPassword,
    });

    await this._emailService.sendEmail(
      this._fromEmail,
      user.email,
      `${process.env.TACH_APPLICATION_NAME} password reset successful`,
      `Your password has been successfully reset. You can now login with your new password.`,
    );
  }

  async authenticatedResetPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this._userQueryRepository.getById(userId);

    if (!user) {
      throw new ErrorWithStatusCode(
        `User with id '${userId}' not found.`,
        404,
        'User not found.',
      );
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      throw new ErrorWithStatusCode('Current password is incorrect.', 400);
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    await this._userCommandRepository.update(userId, {
      password: encryptedPassword,
    });

    await this._emailService.sendEmail(
      this._fromEmail,
      user.email,
      `${process.env.TACH_APPLICATION_NAME} password reset successful`,
      `Your password has been successfully reset. You can now login with your new password.`,
    );
  }

  async verifyEmailAddress(token: string): Promise<void> {
    const users = await this._userQueryRepository.find({ token });

    if (users.length === 0) {
      throw new ErrorWithStatusCode(
        'The provided token was not found.',
        400,
        'The provided token was not found.',
      );
    }

    const user = users[0];

    const isValid = await this._tokenService.validateToken(token, user.email);

    if (!isValid) {
      throw new ErrorWithStatusCode('Token is invalid.', 400);
    }

    await this._userCommandRepository.update(user._id, {
      emailVerified: new Date(Date.now()),
    });
  }

  async setUserRoles(
    userId: string,
    roles: Extract<keyof IUserRolesEnum, string>[],
  ): Promise<IUser> {
    const userDto = await this._userQueryRepository.getById(userId);

    if (!userDto) {
      throw new ErrorWithStatusCode(
        `User with id '${userId}' not found.`,
        404,
        'User not found.',
      );
    }

    await this._userCommandRepository.update(userId, { roles });

    return this.getUserById(userId);
  }

  async getUserById(userId: string): Promise<IUser> {
    const userDto = await this._userQueryRepository.getById(userId);

    if (!userDto) {
      throw new ErrorWithStatusCode(
        `User with id '${userId}' not found.`,
        404,
        'User not found.',
      );
    }

    const userAddresses = await this._userAddressService.getAllUserAddresses(
      userId,
    );

    const products = await this._productService.getProductsByIds(
      userDto.cart.items.map((e) => e.productId),
    );

    const mapper = this._automapperProvider.provide();
    return mapper.map<UserDto, IUser>(userDto, 'UserDto', 'IUser', {
      extraArgs: () => ({ userAddresses, products }),
    });
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<IUser> {
    const userDto = await this._userQueryRepository.find({ phoneNumber });

    if (userDto.length === 0) {
      throw new ErrorWithStatusCode(
        `User with phone number '${phoneNumber}' not found.`,
        404,
        'User not found.',
      );
    }

    const userAddresses = await this._userAddressService.getAllUserAddresses(
      userDto[0]._id,
    );

    const mapper = this._automapperProvider.provide();
    return mapper.map<UserDto, IUser>(userDto[0], 'UserDto', 'IUser', {
      extraArgs: () => ({ userAddresses }),
    });
  }

  async getAllUsers(): Promise<IUser[]> {
    const userDtos = await this._userQueryRepository.list();

    const userAddressPromises: Promise<IUserAddress[]>[] = [];
    for (let i = 0; i < userDtos.length; i++) {
      userAddressPromises.push(
        this._userAddressService.getAllUserAddresses(userDtos[i]._id),
      );
    }
    const userAddresses = await Promise.all(userAddressPromises);

    const mapper = this._automapperProvider.provide();

    const users: IUser[] = [];
    for (let i = 0; i < userDtos.length; i++) {
      users.push(
        mapper.map<UserDto, IUser>(userDtos[i], 'UserDto', 'IUser', {
          extraArgs: () => ({ userAddresses: userAddresses[i] }),
        }),
      );
    }

    return users;
  }

  async disableUser(userId: string): Promise<void> {
    await this._userCommandRepository.update(userId, { disabled: true });
  }

  async deleteUserAndAccount(userId: string): Promise<void> {
    this._userCommandRepository.delete(userId);
    this._accountCommandRepository.deleteMany({ userId });
  }
}

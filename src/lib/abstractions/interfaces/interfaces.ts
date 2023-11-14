import { Readable } from 'stream';
import { JSONSchemaType } from 'ajv';
import { NextApiRequest } from 'next';
import { NextMiddleware } from 'next/server';

// Factories
export interface IFactory<T> {
  create(): T;
}

export interface IProvider<T> {
  provide(): T;
}

export interface IAsyncMultiProvider<T> {
  provideAll(): Promise<{ [key: string]: T }>;
  provide(key: string): Promise<T>;
}

// Adapters
export interface IAdapter<TFrom, TTo> {
  adapt(from: TFrom): TTo;
}

export interface IMergeAdapter<TFrom, TTo extends TFrom> {
  merge(from: TFrom, to: TTo): TTo;
}

// Repositories
export type QueryOptions = {
  skip: number;
  limit: number;
};

export interface ICommandRepository<T> {
  create(entity: T): Promise<string>;
  update(id: string, entity: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  generateId(): Promise<string>;
}

export interface IQueryRepository<T> {
  getById(id: string): Promise<(T & IdModel) | null>;
  list(queryOptions?: QueryOptions): Promise<(T & IdModel)[]>;
  find(filter: any, queryOptions?: QueryOptions): Promise<(T & IdModel)[]>;
}

// Data Providers
export type InsertResponse = {
  insertedIds: Array<string>;
};

export type UpdateResponse = {
  updatedIds: Array<string>;
  matchedCount: number;
  modifiedCount: number;
};

export type DeleteResponse = {
  deletedIds: Array<string>;
};

export type IdModel = {
  _id: string;
};

export type TimeStampedModel = {
  createdAt: string;
  updatedAt: string;
};

export type BaseModel = {} & IdModel & TimeStampedModel;

export type WithId<T> = {
  _id: string;
} & T;

export type PartialIdModelAndTimestampModel = Partial<IdModel> &
  Partial<TimeStampedModel>;

export interface IDatabaseClient {
  insert<T>(
    data: T | Array<T>,
    collectionName: string,
  ): Promise<InsertResponse>;
  updateMany<T extends object>(
    filter: any,
    data: Partial<T>,
    collectionName: string,
  ): Promise<UpdateResponse>;
  deleteMany<T>(filter: any, collectionName: string): Promise<DeleteResponse>;
  select<T extends { _id: string }>(
    filter: any,
    collectionName: string,
    fields?: string[],
    queryOptions?: QueryOptions,
  ): Promise<Array<T>>;
  createIndex(index: any, collectionName: string): Promise<void>;
  generateId(collectionName: string): Promise<string>;
  stringToId(id: string, collectionName: string): Promise<any>;
  truncate(): Promise<boolean>;
}

// Services
export interface IGenericWebService<T> {
  create(entity: T): Promise<T>;
  update(id: string, entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<T | null>;
  getAll(): Promise<Array<T>>;
}

export interface IAdminService {
  addRolesToCurrentUser(roles: Array<string>): Promise<void>;
  deleteAllData(): Promise<string>;
}

export type IFileMetadata = {
  filename: string;
  size: number;
  uploadDate: Date;
  contentType: string;
};

export interface IFileStorageService {
  /**
   * Uploads a file to the storage mechanism defined in tach.config.js
   * @param {string} fileName - The name the file will be saved with.
   * @param {string} filePath - Where the file can be found.
   * @param {string} contentType - The content type of the file.
   * @returns {Promise<string>} - A unique checksum identifier for the file.
   */
  uploadFile(
    fileName: string,
    file: Blob,
    contentType: string,
  ): Promise<string>;

  deleteFile(key: string): Promise<void>;

  /**
   * Saves a file to the storage mechanism defined in tach.config.js
   * @param {string} key - The key of the file to retrieve. This is usually the full path of the file.
   * @returns {Promise<string>} - A signed url that can be used to download the file.
   */
  getSignedUrl(key: string): Promise<string>;

  getDownloadStream(key: string): Promise<Readable>;
  getFileMetadata(key: string): Promise<IFileMetadata>;
}

export interface IImageStorageService {
  uploadImage(
    fileName: string,
    file: Blob,
    contentType: string,
  ): Promise<string>;
}

export interface IEmailService {
  sendEmail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    body: string,
  ): Promise<void>;
}

export type RecaptchaValidationResponse = {
  success: boolean;
  challengeTimestamp: string;
  hostname: string;
  errorCodes?: string[];
};

export interface IRecaptchaValidator {
  validateRecaptchaToken(token: string): Promise<RecaptchaValidationResponse>;
}

// Constants
export const ONE_MEGABYTE = 1048576;

// IOC
export interface IServiceResolver {
  resolve<T>(parameterName: string, extraArgs?: any): T;
}

/**
 * @deprecated
 */
export interface IContainerBuilder {
  bind<T>(parameterName: string, implementation: T): IContainerBuilder;
  build(): IServiceResolver;
}

export interface IModule extends IServiceResolver {}

export interface IModuleProvider {
  provide: string;
  useClass?: any;
  useValue?: any;
  useFactory?: any;
  extraArgs?: { [key: string]: any };
}

export interface IModuleConfig {
  imports?: { new (...args: any[]): IModule }[];
  providers: IModuleProvider[];
}

export interface ILoggerFactory<TLoggerType extends ILogger> {
  create(namespace: string): Promise<TLoggerType>;
}

export interface ILogger {
  log(level: string, message: string, ...metadata: any[]): void;
}

export interface INpmLogger extends ILogger {
  error(message: string, ...metadata: any[]): void;
  warn(message: string, ...metadata: any[]): void;
  info(message: string, ...metadata: any[]): void;
  http(message: string, ...metadata: any[]): void;
  verbose(message: string, ...metadata: any[]): void;
  debug(message: string, ...metadata: any[]): void;
  silly(message: string, ...metadata: any[]): void;
}

export interface IIdOmitter {
  omitId<T extends Partial<IdModel>>(model: T): Omit<T, '_id'>;
}

export type ValidationResult = {
  valid: boolean;
  errors: { [x: string]: any };
};

export interface IValidator {
  validate<T>(
    entity: T,
    schema: JSONSchemaType<T>,
    allowUndefined?: boolean,
  ): ValidationResult;
}

export type FileLike = {
  name: string;
  size: number;
  type: string;
  filepath?: string;
};

export type MultipartFormParserResult = {
  fields: { [key: string]: string };
  files: { [key: string]: FileLike };
};

export interface IFormParser {
  parseMultipartForm(req: NextApiRequest): Promise<MultipartFormParserResult>;
  parseJsonForm<TResult>(req: NextApiRequest): Promise<TResult>;
}

export interface ITokenService {
  createToken(id: string, email: string, expiresIn: string): Promise<string>;
  validateToken(token: string, email: string): Promise<boolean>;
}

// Middleware
export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

import {
  IFactory,
  IFileStorageService,
  IFileStorageConfiguration,
  IOptions,
  IServiceResolver,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'fileStorageServiceFactory',
  'fileStorageConfigurationOptions',
  'serviceResolver',
)
export class FileStorageServiceFactory
  implements IFactory<IFileStorageService>
{
  private _fileStorageConfiguration: IFileStorageConfiguration;

  private _serviceResolver: IServiceResolver;

  constructor(
    fileStorageConfigurationOptions: IOptions<IFileStorageConfiguration>,
    serviceResolver: IServiceResolver,
  ) {
    this._fileStorageConfiguration = fileStorageConfigurationOptions.value;
    this._serviceResolver = serviceResolver;
  }

  create(): IFileStorageService {
    switch (this._fileStorageConfiguration.provider) {
      case 's3':
        return this._serviceResolver.resolve<IFileStorageService>(
          's3FileStorageService',
        );
      case 'dummy':
        return this._serviceResolver.resolve<IFileStorageService>(
          'dummyFileStorageService',
        );
      case 'mongodb':
        return this._serviceResolver.resolve<IFileStorageService>(
          'mongodbFileStorageService',
        );
      default:
        throw new Error(
          `Storage provider '${this._fileStorageConfiguration.provider}' is not supported.`,
        );
    }
  }
}

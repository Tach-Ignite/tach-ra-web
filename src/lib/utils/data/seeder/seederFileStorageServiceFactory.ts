import {
  IFactory,
  IPublicFileStorageService,
  IOptions,
  IServiceResolver,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { ISeedFilesConfiguration } from './abstractions';

@Injectable(
  'fileStorageServiceFactory',
  'seedFilesConfigurationOptions',
  'serviceResolver',
)
export class SeederFileStorageServiceFactory
  implements IFactory<IPublicFileStorageService>
{
  private _fileStorageConfiguration: ISeedFilesConfiguration;

  private _serviceResolver: IServiceResolver;

  constructor(
    seedFilesConfigurationOptions: IOptions<ISeedFilesConfiguration>,
    serviceResolver: IServiceResolver,
  ) {
    this._fileStorageConfiguration = seedFilesConfigurationOptions.value;
    this._serviceResolver = serviceResolver;
  }

  create(): IPublicFileStorageService {
    switch (this._fileStorageConfiguration.provider) {
      case 's3':
        return this._serviceResolver.resolve<IPublicFileStorageService>(
          's3FileStorageService',
        );
      case 'dummy':
        return this._serviceResolver.resolve<IPublicFileStorageService>(
          'dummyFileStorageService',
        );
      case 'mongodb':
        return this._serviceResolver.resolve<IPublicFileStorageService>(
          'mongodbFileStorageService',
        );
      default:
        throw new Error(
          `Storage provider '${this._fileStorageConfiguration.provider}' is not supported.`,
        );
    }
  }
}

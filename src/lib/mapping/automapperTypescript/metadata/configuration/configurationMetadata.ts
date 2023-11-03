import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import {
  IAuthConfiguration,
  IDarkModeConfiguration,
  IDataStorageConfiguration,
  IFileStorageConfiguration,
  ILoggingConfiguration,
  IPaymentConfiguration,
  ITachConfiguration,
} from '@/lib/abstractions';

export const paymentConfigurationMetadata = {
  provider: String,
};

export const loggingConfigurationMetadata = {
  provider: String,
};

export const authConfigurationMetadata = {
  providers: [String],
};

export const fileStorageConfigurationMetadata = {
  provider: String,
};

export const dataStorageConfigurationMetadata = {
  provider: String,
};

export const tachConfigurationMetadata = {
  storage: dataStorageConfigurationMetadata,
  auth: authConfigurationMetadata,
};

export function createTachConfigurationMetadata() {
  PojosMetadataMap.create<IDarkModeConfiguration>('IDarkModeConfiguration', {
    default: String,
  });
  PojosMetadataMap.create<IPaymentConfiguration>(
    'IPaymentConfiguration',
    paymentConfigurationMetadata,
  );
  PojosMetadataMap.create<ILoggingConfiguration>(
    'ILoggingConfiguration',
    loggingConfigurationMetadata,
  );
  PojosMetadataMap.create<IAuthConfiguration>('IAuthConfiguration', {
    providers: [String],
  });
  PojosMetadataMap.create<IFileStorageConfiguration>(
    'IFileStorageConfiguration',
    fileStorageConfigurationMetadata,
  );
  PojosMetadataMap.create<IDataStorageConfiguration>(
    'IDataStorageConfiguration',
    dataStorageConfigurationMetadata,
  );
  PojosMetadataMap.create<ITachConfiguration>('ITachConfiguration', {
    storage: 'IDataStorageConfiguration',
    auth: 'IAuthConfiguration',
  });
}

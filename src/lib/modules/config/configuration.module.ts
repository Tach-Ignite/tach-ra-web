import {
  IAuthConfiguration,
  IConfigurationFactory,
  IDarkModeConfiguration,
  IDataStorageConfiguration,
  IFileStorageConfiguration,
  ILoggingConfiguration,
  INotificationsConfiguration,
  IPaymentConfiguration,
  IRecaptchaConfiguration,
  ISecretsConfiguration,
  IServiceResolver,
} from '@/lib/abstractions';
import { ConfigurationFactory } from '@/lib/config/configurationFactory';
import { Options } from '@/lib/config/options';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { getTachConfig } from '@/lib/utils/getTachConfig';

@Module
export class ConfigurationModule extends ModuleClass {
  constructor() {
    super({
      providers: [
        {
          provide: 'configFile',
          useValue: getTachConfig(),
        },
        {
          provide: 'configurationFactory',
          useClass: ConfigurationFactory,
        },
        {
          provide: 'authConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const authSection = config.getSection<IAuthConfiguration>('auth');
            if (!authSection) return null;
            return new Options(authSection);
          },
        },
        {
          provide: 'dataStorageConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const storageDataSection =
              config.getSection<IDataStorageConfiguration>('storage.data');
            if (!storageDataSection) {
              return null;
            }
            return new Options(storageDataSection);
          },
        },
        {
          provide: 'fileStorageConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const storageFileSection =
              config.getSection<IFileStorageConfiguration>('storage.files');
            if (!storageFileSection) {
              return null;
            }
            return new Options(storageFileSection);
          },
        },
        {
          provide: 'loggingConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const loggingSection =
              config.getSection<ILoggingConfiguration>('logging');
            if (!loggingSection) {
              return null;
            }
            return new Options(loggingSection);
          },
        },
        {
          provide: 'paymentConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const paymentSection =
              config.getSection<IPaymentConfiguration>('payment');
            if (!paymentSection) {
              return null;
            }
            return new Options(paymentSection);
          },
        },
        {
          provide: 'darkModeConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const darkModeSection =
              config.getSection<IDarkModeConfiguration>('darkMode');
            if (!darkModeSection) {
              return null;
            }
            return new Options(darkModeSection);
          },
        },
        {
          provide: 'secretsConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const section = config.getSection<ISecretsConfiguration>('secrets');
            if (!section) {
              return null;
            }
            return new Options(section);
          },
        },
        {
          provide: 'notificationsConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const section =
              config.getSection<INotificationsConfiguration>('notifications');
            if (!section) {
              return null;
            }
            return new Options(section);
          },
        },
        {
          provide: 'recaptchaConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const section =
              config.getSection<IRecaptchaConfiguration>('recaptcha');
            if (!section) {
              return null;
            }
            return new Options(section);
          },
        },
      ],
    });
  }
}

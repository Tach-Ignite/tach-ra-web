export interface IConfigurationSection {}

export interface IConfiguration {
  getSection<T extends IConfigurationSection>(sectionName: string): T | null;
}

export interface IConfigurationFactory {
  create(configFile: any): IConfiguration;
}

export interface IOptions<T extends object> {
  get value(): T;
}

export interface ITachConfiguration {
  storage: IDataStorageConfiguration;
  auth: IAuthConfiguration;
}

export interface IDataStorageConfiguration extends IConfigurationSection {
  provider: string;
}

export interface IFileStorageConfiguration extends IConfigurationSection {
  provider: string;
}

export interface IAuthConfiguration extends IConfigurationSection {
  providers: Array<string>;
}

export interface ILoggingConfiguration extends IConfigurationSection {
  provider: string;
}

export interface IPaymentConfiguration extends IConfigurationSection {
  provider: string;
}

export interface IDarkModeConfiguration extends IConfigurationSection {
  default: 'dark' | 'light' | 'system';
}

export interface ISecretsConfiguration extends IConfigurationSection {
  provider: 'env' | 'ssm';
}

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
  logging: ILoggingConfiguration;
  payment: IPaymentConfiguration;
  darkMode: IDarkModeConfiguration;
  secrets: ISecretsConfiguration;
  notifications: INotificationsConfiguration;
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

export interface INotificationsEmailConfiguration
  extends IConfigurationSection {
  provider: 'ses' | 'console';
}

export interface INotificationsSmsConfiguration extends IConfigurationSection {
  provider: 'sns' | 'twilio' | 'console';
}

export interface INotificationsConfiguration extends IConfigurationSection {
  email: INotificationsEmailConfiguration;
  sms: INotificationsSmsConfiguration;
}

export interface IRecaptchaConfiguration extends IConfigurationSection {
  provider: 'google' | 'fake';
}

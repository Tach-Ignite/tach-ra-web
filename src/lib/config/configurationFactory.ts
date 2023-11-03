import { IConfiguration, IConfigurationFactory } from '@/lib/abstractions';
import { Configuration } from './configuration';
import { Injectable } from '../ioc/injectable';

@Injectable('configurationFactory')
export class ConfigurationFactory implements IConfigurationFactory {
  create(configFile: any): IConfiguration {
    return new Configuration(configFile);
  }
}

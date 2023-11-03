import { IConfiguration, IConfigurationSection } from '@/lib/abstractions';
import { Injectable } from '../ioc/injectable';

@Injectable('configuration', 'configFile')
export class Configuration implements IConfiguration {
  private _configFile: any;

  constructor(configFile: any) {
    this._configFile = configFile;
  }

  getSection<T extends IConfigurationSection>(sectionName: string): T | null {
    const slugs = sectionName.split('.');
    let currentSection = this._configFile;
    for (let i = 0; i < slugs.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(currentSection, slugs[i])) {
        return null;
      }
      if (i === slugs.length - 1) {
        return currentSection[slugs[i]] as T;
      }
      currentSection = currentSection[slugs[i]];
    }
    return null;
  }
}

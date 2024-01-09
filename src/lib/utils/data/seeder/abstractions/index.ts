import { IConfigurationSection, IDatabaseClient } from '@/lib/abstractions';

export interface IDataLoader {
  loadFiles<T>(): Promise<void>;
  loadData<T>(sectionName: string): Promise<Array<T>>;
  loadIndexes(sectionName: string): Promise<Array<any>>;
  getDataSectionNames(): Promise<Array<string>>;
  getIndexSectionNames(): Promise<Array<string>>;
}

export interface ISeeder {
  seed(): Promise<void>;
}

export interface ISeedDataConfiguration extends IConfigurationSection {
  provider: string;
  dataFiles: Array<string>;
  indexFiles: Array<string>;
  modelFiles: Array<string>;
}

export interface ISeedFilesConfiguration extends IConfigurationSection {
  provider: string;
  files: Array<string>;
}

export interface ISeedConfiguration extends IConfigurationSection {
  data: ISeedDataConfiguration;
  files: ISeedFilesConfiguration;
}

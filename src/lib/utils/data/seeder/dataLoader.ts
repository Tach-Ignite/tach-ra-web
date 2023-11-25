import fs from 'fs';
import {
  IFactory,
  IPublicFileStorageService,
  IOptions,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { IDataLoader, ISeedConfiguration } from './abstractions';

@Injectable(
  'dataLoader',
  'seedConfigurationOptions',
  'fileStorageServiceFactory',
)
export class DataLoader implements IDataLoader {
  private _seedConfiguration: ISeedConfiguration;

  private _fileStorageServiceFactory: IFactory<IPublicFileStorageService>;

  constructor(
    seedConfigurationOptions: IOptions<ISeedConfiguration>,
    fileStorageServiceFactory: IFactory<IPublicFileStorageService>,
  ) {
    this._seedConfiguration = seedConfigurationOptions.value;
    this._fileStorageServiceFactory = fileStorageServiceFactory;
  }

  async loadFiles(): Promise<void> {
    const fileStorageService = this._fileStorageServiceFactory.create();
    const importPromises: Promise<any>[] = [];
    for (let i = 0; i < this._seedConfiguration.files.length; i++) {
      importPromises.push(import(this._seedConfiguration.files[i]));
    }
    const imports = await Promise.all(importPromises);
    const fileStoragePromises: Promise<string>[] = [];
    for (let i = 0; i < this._seedConfiguration.files.length; i++) {
      const data = imports[i].default;
      for (let j = 0; j < data.length; j++) {
        const { key, filepath, metadata } = data[j];
        const buffer = fs.readFileSync(filepath);
        const blob = new Blob([buffer]);
        fileStoragePromises.push(
          fileStorageService.uploadFile(key, blob, metadata.contentType),
        );
      }
    }
    await Promise.all(fileStoragePromises);
  }

  async loadData<T>(sectionName: string): Promise<Array<T>> {
    let aggregateData: T[] = [];
    const importPromises: Promise<any>[] = [];
    for (let i = 0; i < this._seedConfiguration.data.length; i++) {
      importPromises.push(import(this._seedConfiguration.data[i]));
    }
    const imports = await Promise.all(importPromises);
    for (let i = 0; i < this._seedConfiguration.data.length; i++) {
      const data = imports[i].default;
      if (Object.prototype.hasOwnProperty.call(data, sectionName)) {
        aggregateData = [...aggregateData, ...(data[sectionName] as Array<T>)];
      }
    }
    if (aggregateData.length === 0) {
      throw new Error(`Section ${sectionName} not found in seed data.`);
    }
    return aggregateData;
  }

  async loadIndexes(sectionName: string): Promise<Array<any>> {
    let aggregateIndexes: any[] = [];
    const importPromises: Promise<any>[] = [];
    for (let i = 0; i < this._seedConfiguration.indexes.length; i++) {
      importPromises.push(import(this._seedConfiguration.indexes[i]));
    }
    const imports = await Promise.all(importPromises);
    for (let i = 0; i < this._seedConfiguration.indexes.length; i++) {
      const index = imports[i].default;
      if (Object.prototype.hasOwnProperty.call(index, sectionName)) {
        aggregateIndexes = [
          ...aggregateIndexes,
          ...(index[sectionName] as Array<any>),
        ];
      }
    }
    if (aggregateIndexes.length === 0) {
      throw new Error(`Section ${sectionName} not found in seed data.`);
    }
    return aggregateIndexes;
  }

  async getIndexSectionNames(): Promise<Array<string>> {
    return this.getSectionNames(this._seedConfiguration.indexes);
  }

  async getDataSectionNames(): Promise<Array<string>> {
    return this.getSectionNames(this._seedConfiguration.data);
  }

  private async getSectionNames(
    configSection: string[],
  ): Promise<Array<string>> {
    const sectionNames: Array<string> = [];
    const importPromises: Promise<any>[] = [];
    if (!configSection) {
      return sectionNames;
    }
    for (let i = 0; i < configSection.length; i++) {
      importPromises.push(import(configSection[i]));
    }
    const imports = await Promise.all(importPromises);
    for (let i = 0; i < configSection.length; i++) {
      const data = imports[i].default;
      Object.keys(data).forEach((sectionName) => {
        if (!sectionNames.includes(sectionName)) {
          sectionNames.push(sectionName);
        }
      });
    }
    return sectionNames;
  }
}

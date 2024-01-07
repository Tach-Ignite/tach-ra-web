import dotenv from 'dotenv';
import { IDatabaseClient, IFactory, InsertResponse } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import fs from 'fs';
import { IDataLoader, ISeeder } from './abstractions';
import { getTachConfig } from '../../getTachConfig';

@Injectable('seeder', 'dataLoader', 'databaseClientFactory')
export class Seeder implements ISeeder {
  private _dataLoader: IDataLoader;

  private _databaseClientFactory: IFactory<Promise<IDatabaseClient>>;

  constructor(
    dataLoader: IDataLoader,
    databaseClientFactory: IFactory<Promise<IDatabaseClient>>,
    env: string = 'local',
  ) {
    dotenv.config({
      path: `${process.cwd()}/.env.${env}`,
    });

    let rawSecrets = {};
    let secrets = '{}';
    const config = getTachConfig();
    if (
      config.secrets.provider === 'env' &&
      process.env.NODE_ENV !== 'production'
    ) {
      const f = fs.readFileSync(`./.env.secrets.${env}`);
      rawSecrets = dotenv.parse(f);
      secrets = JSON.stringify(rawSecrets);
    }
    process.env.secrets = secrets;

    this._dataLoader = dataLoader;

    this._databaseClientFactory = databaseClientFactory;
  }

  async seed(): Promise<void> {
    const databaseClient = await this._databaseClientFactory.create();
    await databaseClient.truncate();
    const sectionNames = await this._dataLoader.getDataSectionNames();
    const dataLoaderPromises: Promise<any>[] = [];
    for (let i = 0; i < sectionNames.length; i++) {
      dataLoaderPromises.push(this._dataLoader.loadData(sectionNames[i]));
    }
    const indexSectionNames = await this._dataLoader.getIndexSectionNames();
    const indexPromises: Promise<any>[] = [];
    for (let i = 0; i < indexSectionNames.length; i++) {
      indexPromises.push(this._dataLoader.loadIndexes(indexSectionNames[i]));
    }
    const databasePromises: Promise<InsertResponse>[] = [];
    const dataLoaderResults = await Promise.all(dataLoaderPromises);
    for (let i = 0; i < sectionNames.length; i++) {
      const rawData = dataLoaderResults[i];
      if (!rawData) {
        throw new Error(`Could not load data for section ${sectionNames[i]}.`);
      }
      for (let k = 0; k < rawData.length; k++) {
        const data = rawData[k];
        databasePromises.push(databaseClient.insert(data, sectionNames[i]));
      }
    }
    await Promise.all(databasePromises);

    const indexResults = await Promise.all(indexPromises);
    const indexDatabasePromises: Promise<void>[] = [];
    for (let i = 0; i < indexSectionNames.length; i++) {
      const indexes = indexResults[i];
      if (!indexes) {
        throw new Error(
          `Could not load indexes for section ${indexSectionNames[i]}.`,
        );
      }
      for (let k = 0; k < indexes.length; k++) {
        const index = indexes[k];
        indexDatabasePromises.push(
          databaseClient.createIndex(index, indexSectionNames[i]),
        );
      }
    }
    await Promise.all(indexDatabasePromises);

    await this._dataLoader.loadFiles();
  }
}

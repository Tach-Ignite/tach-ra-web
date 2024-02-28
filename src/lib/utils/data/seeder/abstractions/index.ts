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

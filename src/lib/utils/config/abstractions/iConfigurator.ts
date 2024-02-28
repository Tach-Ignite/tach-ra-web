export interface IConfigurator {
  configureAll(): Promise<void>;
  configure(serviceCode: string): Promise<void>;
}

export interface IConfigurator {
  configureAll(): Promise<void>;
  configure(serviceCode: string): Promise<void>;
  help(): void;
  help(command: string): void;
}

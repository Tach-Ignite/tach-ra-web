import { IModule, IModuleConfig, IModuleProvider } from '../abstractions';
import { DependencyRegistry } from './dependencyRegistry';

export function Module<T extends { new (...args: any[]): IModule }>(
  TheClass: T,
  context: ClassDecoratorContext<T>,
) {
  if (!context || !context.name) {
    return TheClass;
  }

  const dependencyRegistry = new DependencyRegistry();
  dependencyRegistry.registerModule(TheClass);

  return TheClass;
}

export class ModuleClass implements IModule {
  private _registry: DependencyRegistry = new DependencyRegistry();

  private _providers: IModuleProvider[] = [];

  private _importModules: { new (...args: any[]): IModule }[] = [];

  constructor(moduleConfig: IModuleConfig) {
    this._importModules = moduleConfig.imports || [];

    for (let i = 0; i < this._importModules.length; i++) {
      this._registry.registerModule(this._importModules[i]);
    }

    this._providers = moduleConfig.providers;
    this.registerProviders();
  }

  private registerProviders() {
    this._providers.forEach((provider: IModuleProvider) => {
      if (provider.useClass) {
        this._registry.registerNode(
          provider.provide,
          provider.useClass,
          [],
          provider.extraArgs,
        );
      } else if (provider.useValue) {
        this._registry.registerNode(provider.provide, provider.useValue);
      } else if (provider.useFactory) {
        this._registry.registerNode(
          provider.provide,
          provider.useFactory,
          [],
          provider.extraArgs,
          true,
        );
      }
    });
  }

  resolve<T>(
    token: string,
    extraArgs: { [key: string]: any } | undefined = undefined,
  ): T {
    return this._registry.resolve(token, extraArgs);
  }
}

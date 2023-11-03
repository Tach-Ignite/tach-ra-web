import { IModule } from '../abstractions';
import { DependencyRegistry } from './dependencyRegistry';

export class ModuleResolver {
  private _dependencyRegistry: DependencyRegistry = new DependencyRegistry();

  resolve<T extends { new (...args: any[]): {} }>(module: T): IModule {
    return this._dependencyRegistry.getModule(module);
  }
}

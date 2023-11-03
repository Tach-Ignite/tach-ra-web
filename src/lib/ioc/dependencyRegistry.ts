import { ErrorWithStatusCode } from '../errors';
import { IModule, IServiceResolver } from '../abstractions';
import { RegistryNode } from './registryNode';

export class DependencyRegistry implements IServiceResolver {
  private static _registry: Map<symbol, RegistryNode<any>> = new Map();

  private static _moduleRegistry: Map<symbol, IModule> = new Map();

  registerNode<T>(
    token: string,
    implementation: T,
    dependencyTokens: string[] = [],
    extraArgs: { [key: string]: any } | undefined = undefined,
    isFactory: boolean = false,
  ) {
    if (!DependencyRegistry._registry.has(Symbol.for(token))) {
      DependencyRegistry._registry.set(
        Symbol.for(token),
        new RegistryNode(implementation, extraArgs, isFactory),
      );
    }
    for (let i = 0; i < dependencyTokens.length; i++) {
      this.registerDependency(token, dependencyTokens[i], i);
    }
  }

  registerModule<T extends { new (...args: any[]): IModule }>(module: T) {
    // eslint-disable-next-line new-cap
    const moduleInstance = new module();
    DependencyRegistry._moduleRegistry.set(
      Symbol.for(module.name),
      moduleInstance,
    );
  }

  getModule<T extends { new (...args: any[]): {} }>(module: T): IModule {
    const s = Symbol.for('serviceResolver');
    if (!DependencyRegistry._registry.has(s)) {
      DependencyRegistry._registry.set(s, new RegistryNode(this));
    }

    const moduleClass = DependencyRegistry._moduleRegistry.get(
      Symbol.for(module.name),
    );
    if (!moduleClass) {
      throw new ErrorWithStatusCode(`No module found for ${module.name}`, 500);
    }
    return moduleClass;
  }

  private registerDependency(
    nodeToken: string,
    parameterToken: string,
    parameterIndex: number,
  ) {
    const registryNode = DependencyRegistry._registry.get(
      Symbol.for(nodeToken),
    );
    if (!registryNode) {
      throw new ErrorWithStatusCode(
        `No implementation found for ${nodeToken}`,
        500,
      );
    }
    if (!registryNode.getDependencies().has(Symbol.for(parameterToken))) {
      registryNode.registerDependency(
        Symbol.for(parameterToken),
        parameterIndex,
      );
    }
  }

  resolve<T>(
    token: string,
    extraArgs: { [key: string]: any } | undefined = undefined,
  ): T {
    return this.resolveFromSymbol(Symbol.for(token), extraArgs);
  }

  private resolveFromSymbol(
    s: symbol,
    extraArgs: { [key: string]: any } | undefined = undefined,
  ) {
    const registryNode = DependencyRegistry._registry.get(s);
    if (!registryNode) {
      throw new Error(`No implementation found for ${s.toString()}`);
    }
    if (registryNode.isFactory) {
      return registryNode.value(this, extraArgs);
    }
    if (!this.isClass(registryNode.value)) {
      return registryNode.value;
    }

    const dependencies = registryNode.getDependencies();
    const mergedExtraArgs = registryNode.extraArgs || extraArgs || {};
    const extraArgsKeys = mergedExtraArgs
      ? Object.keys(mergedExtraArgs).map((k) => Symbol.for(k))
      : [];
    const resolvedDependencies: any[] = [...dependencies.keys()]
      .filter((k) => !extraArgsKeys.includes(k))
      .map((dependency: symbol) => this.resolveFromSymbol(dependency));

    if (mergedExtraArgs) {
      // eslint-disable-next-line new-cap
      return new registryNode.value(
        ...resolvedDependencies,
        ...Object.entries(mergedExtraArgs).map(([k, v]) => v),
      );
    }
    // eslint-disable-next-line new-cap
    return new registryNode.value(...resolvedDependencies);
  }

  clear() {
    DependencyRegistry._registry.clear();
  }

  private isClass(value: any): boolean {
    return (
      typeof value === 'function' &&
      (/^\s*class\s+/.test(value.toString()) ||
        /^\s*class\b/.test(value.toString())) &&
      typeof value.prototype === 'object'
    );
  }
}

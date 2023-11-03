import { IContainerBuilder, IServiceResolver } from '@/lib/abstractions';

/**
 * @deprecated
 */
export class Container implements IContainerBuilder, IServiceResolver {
  private bindings: { [key: string]: any } = {};

  private extraParams: { [key: string]: any } = {};

  bind<TInterface>(
    interfaceName: string,
    implementation: any,
    extraParams?: any,
  ): IContainerBuilder {
    this.bindings[interfaceName] = implementation;
    if (extraParams) {
      this.extraParams[interfaceName] = extraParams;
    }
    return this;
  }

  resolve<T>(interfaceName: string, extraArgs?: any): T {
    const implementation = this.bindings[interfaceName];
    if (!implementation) {
      throw new Error(`No implementation found for ${interfaceName}`);
    }
    if (typeof implementation === 'function') {
      const dependencies = this.getDependencies(implementation);
      const extraParamsKeys = this.extraParams[interfaceName]
        ? Object.keys(this.extraParams[interfaceName])
        : [];
      const extraArgsKeys = extraArgs ? Object.keys(extraArgs) : [];
      const filteredDependencies = dependencies.filter(
        (dependency: string) =>
          !extraParamsKeys.includes(dependency) &&
          !extraArgsKeys.includes(dependency),
      );
      const resolvedExtraParams = extraParamsKeys.map(
        (key: string) => this.extraParams[interfaceName][key],
      );
      const resolvedDependencies = [
        ...filteredDependencies.map((dependency: string) =>
          this.resolveRecursive(dependency),
        ),
        ...resolvedExtraParams,
      ];

      let extraArgsArray = [];
      if (extraArgs) {
        extraArgsArray = Object.keys(extraArgs).map(
          (key: string) => extraArgs[key],
        );
      }
      // eslint-disable-next-line new-cap
      return new implementation(...resolvedDependencies, ...extraArgsArray);
    }
    return implementation;
  }

  resolveRecursive<T>(interfaceName: string): T {
    const implementation = this.bindings[interfaceName];
    if (!implementation) {
      throw new Error(`No implementation found for ${interfaceName}`);
    }
    if (typeof implementation === 'function') {
      const dependencies = this.getDependencies(implementation);
      const extraParamsKeys = this.extraParams[interfaceName]
        ? Object.keys(this.extraParams[interfaceName])
        : [];
      const filteredDependencies = dependencies.filter(
        (dependency: string) => !extraParamsKeys.includes(dependency),
      );
      const resolvedExtraParams = extraParamsKeys.map(
        (key: string) => this.extraParams[interfaceName][key],
      );
      const resolvedDependencies = [
        ...filteredDependencies.map((dependency: string) =>
          this.resolveRecursive(dependency),
        ),
        ...resolvedExtraParams,
      ];
      // eslint-disable-next-line new-cap
      return new implementation(...resolvedDependencies);
    }
    return implementation;
  }

  build(): IServiceResolver {
    return this;
  }

  private getDependencies(implementation: any): string[] {
    const constructorString = implementation.toString();
    const parameterRegex = /constructor\s*\(([^)]*)\)/;
    const match = constructorString.match(parameterRegex);
    if (match && match[1]) {
      return match[1].split(',').map((parameter: string) => parameter.trim());
    }
    return [];
  }
}

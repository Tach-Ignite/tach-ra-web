import { DependencyRegistry } from './dependencyRegistry';

export function Injectable(token: string, ...dependecyTokens: string[]) {
  return function decorator<
    T extends {
      new (...args: any[]): {};
    },
  >(TheClass: T, context: ClassDecoratorContext<T>) {
    const dependencyRegistry = new DependencyRegistry();
    dependencyRegistry.registerNode(token, TheClass, dependecyTokens);

    return TheClass;
  };
}

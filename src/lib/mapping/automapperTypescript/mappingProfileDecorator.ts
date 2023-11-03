import {
  MappingConfiguration,
  MappingProfile,
} from '@jersmart/automapper-core';
import { MappingProfileRegistry } from './mappingProfileRegistry';

export function TachMappingProfileClass(
  uniqueSymbol: string,
  ...extraOptions: MappingConfiguration<any, any>[]
) {
  return function decorator<
    T extends {
      new (...args: any[]): { getMappingProfile: () => MappingProfile };
    },
  >(TheClass: T, context: ClassDecoratorContext<T>) {
    const mappingProfileRegistry = new MappingProfileRegistry();
    const instance = new TheClass();

    mappingProfileRegistry.registerMappingProfile(
      uniqueSymbol,
      instance.getMappingProfile(),
      extraOptions,
    );

    return TheClass;
  };
}

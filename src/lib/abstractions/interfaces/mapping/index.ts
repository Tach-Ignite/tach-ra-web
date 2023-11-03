import {
  MappingConfiguration,
  MappingProfile,
} from '@jersmart/automapper-core';

export type Dictionary<T> = {
  [key in keyof T]?: unknown;
};
export type Constructor<T = any> = new (...args: any[]) => T;
export type ModelIdentifier<T = any> = string | symbol | Constructor<T>;

type MapCallback<
  TSource extends Dictionary<TSource>,
  TDestination extends Dictionary<TDestination>,
  TExtraArgs extends Record<string, any> = Record<string, any>,
> = (
  source: TSource,
  destination: TDestination,
  extraArguments?: TExtraArgs,
) => void;
export interface MapOptions<
  TSource extends Dictionary<TSource>,
  TDestination extends Dictionary<TDestination>,
  TExtraArgs extends Record<string, any> = Record<string, any>,
> {
  beforeMap?: MapCallback<TSource, TDestination, TExtraArgs>;
  afterMap?: MapCallback<TSource, TDestination, TExtraArgs>;
  extraArgs?: () => TExtraArgs;
}
export interface IMapper {
  map<TSource, TDestination>(
    entity: TSource,
    fromKey: ModelIdentifier<TSource>,
    toKey: ModelIdentifier<TDestination>,
    options?: MapOptions<TSource, TDestination>,
  ): TDestination;
  mapArray<TSource, TDestination>(
    entity: TSource[],
    fromKey: ModelIdentifier<TSource>,
    toKey: ModelIdentifier<TDestination>,
    options?: MapOptions<TSource, TDestination>,
  ): TDestination[];
}

// TODO: decouple from automapper (MappingProfile)
export interface IMappingProfileWithOptions {
  mappingProfile: MappingProfile;
  extraOptions: MappingConfiguration[];
}

export interface IMappingProfileRegistry {
  get isDirty(): boolean;
  getMappingProfiles(): IMappingProfileWithOptions[];
  registerMappingProfile(
    symbol: string,
    profile: MappingProfile,
    extraOptions: MappingConfiguration[],
  ): void;
}

export interface ITachMappingProfile {
  getMappingProfile(): MappingProfile;
}

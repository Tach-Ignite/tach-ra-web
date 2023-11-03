import {
  MappingConfiguration,
  MappingProfile,
} from '@jersmart/automapper-core';
import {
  IMappingProfileRegistry,
  IMappingProfileWithOptions,
} from '@/lib/abstractions';

export class MappingProfileRegistry implements IMappingProfileRegistry {
  private static _collection: IMappingProfileWithOptions[] = [];

  private static _isDirty = false;

  private static _symbols: symbol[] = [];

  public get isDirty(): boolean {
    return MappingProfileRegistry._isDirty;
  }

  public getMappingProfiles(): IMappingProfileWithOptions[] {
    MappingProfileRegistry._isDirty = false;
    return MappingProfileRegistry._collection;
  }

  public registerMappingProfile(
    symbol: string,
    profile: MappingProfile,
    extraOptions: MappingConfiguration[] = [],
  ): void {
    const asSymbol = Symbol.for(symbol);
    if (MappingProfileRegistry._symbols.includes(asSymbol)) {
      return;
    }
    MappingProfileRegistry._isDirty = true;
    MappingProfileRegistry._symbols.push(asSymbol);
    MappingProfileRegistry._collection.push({
      mappingProfile: profile,
      extraOptions,
    } as IMappingProfileWithOptions);
  }
}

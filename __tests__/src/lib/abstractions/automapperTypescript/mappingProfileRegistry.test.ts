import { MappingProfileRegistry } from '@/lib/mapping';
import {
  Mapper,
  Mapping,
  MappingConfiguration,
} from '@jersmart/automapper-core';

describe('src/lib/abstractions/automapperTypescript/mappingProfileRegistry', () => {
  afterEach(() => {
    // Cleanup
    MappingProfileRegistry._collection = [];
    MappingProfileRegistry._isDirty = false;
    MappingProfileRegistry._symbols = [];
  });
  it('initializes dirty to false.', () => {
    // Arrange
    const mappingProfileRegistry = new MappingProfileRegistry();

    // Assert
    expect(mappingProfileRegistry.isDirty).toBe(false);
  });
  it('sets dirty to true after adding a mapping.', () => {
    // Arrange
    const mappingProfileRegistry = new MappingProfileRegistry();

    // Act
    mappingProfileRegistry.registerMappingProfile('test', (mapper) => {});

    // Assert
    expect(mappingProfileRegistry.isDirty).toBe(true);
  });
  it('sets dirty to false after getting mapping profiles.', () => {
    // Arrange
    const mappingProfileRegistry = new MappingProfileRegistry();

    // Act
    mappingProfileRegistry.registerMappingProfile('test', (mapper) => {});
    mappingProfileRegistry.getMappingProfiles();

    // Assert
    expect(mappingProfileRegistry.isDirty).toBe(false);
  });
  it('prevents the same symbol from being added twice.', () => {
    // Arrange
    const mappingProfileRegistry = new MappingProfileRegistry();

    // Act
    mappingProfileRegistry.registerMappingProfile('test', (mapper) => {});
    mappingProfileRegistry.registerMappingProfile('test', (mapper) => {});

    // Assert
    expect(mappingProfileRegistry.getMappingProfiles().length).toBe(1);
  });
  it('returns all added mapping profiles.', () => {
    // Arrange
    const mappingProfileRegistry = new MappingProfileRegistry();
    const mp1 = (mapper: Mapper) => {};
    const mp2 = (mapper: Mapper) => {};
    const mp3 = (mapper: Mapper) => {};

    // Act
    mappingProfileRegistry.registerMappingProfile('test1', mp1);
    mappingProfileRegistry.registerMappingProfile('test2', mp2);
    mappingProfileRegistry.registerMappingProfile('test3', mp3);
    const result = mappingProfileRegistry.getMappingProfiles();

    // Assert
    expect(result.length).toBe(3);
    expect(result.map((x) => x.mappingProfile)).toEqual(
      expect.arrayContaining([mp1, mp2, mp3]),
    );
  });
  it('contains all options', () => {
    // Arrange
    const mappingProfileRegistry = new MappingProfileRegistry();
    const mp1 = (mapper: Mapper) => {};
    const o1: MappingConfiguration = (mapping: Mapping) => {};
    const o2 = (mapping: Mapping) => {};

    // Act
    mappingProfileRegistry.registerMappingProfile('test1', mp1, [o1, o2]);
    const result = mappingProfileRegistry.getMappingProfiles();

    // Assert
    expect(result.map((x) => x.extraOptions).flat()).toEqual(
      expect.arrayContaining([o1, o2]),
    );
  });
  it('contains mappings created from another instance', () => {
    // Arrange
    const mpr1 = new MappingProfileRegistry();
    const mpr2 = new MappingProfileRegistry();
    const mp1 = (mapper: Mapper) => {};

    // Act
    mpr1.registerMappingProfile('test1', mp1);
    const result = mpr2.getMappingProfiles();

    // Assert
    expect(result.length).toBe(1);
    expect(result.map((x) => x.mappingProfile)).toEqual(
      expect.arrayContaining([mp1]),
    );
  });
});

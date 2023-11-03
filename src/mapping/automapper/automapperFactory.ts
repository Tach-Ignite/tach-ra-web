import {
  CamelCaseNamingConvention,
  addProfile,
  createMapper,
  AutoMapperLogger,
} from '@jersmart/automapper-core';
import { pojos } from '@jersmart/automapper-pojos';
import { IFactory, IMapper, IMappingProfileRegistry } from '@/lib/abstractions';
import { createLibMetadata } from '@/lib/mapping/automapperTypescript/metadata';
import { createModelMetadata } from '@/models/createModelMetadata';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('automapperFactory', 'mappingProfileRegistry')
export class AutomapperFactory implements IFactory<IMapper> {
  private _mappingProfileCollection: IMappingProfileRegistry;

  constructor(mappingProfileCollection: IMappingProfileRegistry) {
    this._mappingProfileCollection = mappingProfileCollection;
  }

  create(): IMapper {
    AutoMapperLogger.configure();
    createLibMetadata();
    createModelMetadata();
    const mapper = createMapper({
      strategyInitializer: pojos(),
      namingConventions: new CamelCaseNamingConvention(),
    });
    this._mappingProfileCollection.getMappingProfiles().forEach((profile) => {
      addProfile(mapper, profile.mappingProfile, ...profile.extraOptions);
    });
    return mapper as IMapper;
  }
}

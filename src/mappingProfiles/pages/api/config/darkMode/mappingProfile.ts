import { Mapper, MappingProfile, createMap } from '@jersmart/automapper-core';
import {
  IDarkModeConfiguration,
  ITachMappingProfile,
} from '@/lib/abstractions';
import { TachMappingProfileClass } from '@/lib/mapping';
import { DarkModeConfigurationViewModel } from '@/models';

@TachMappingProfileClass('pages/api/config/darkMode/mappingProfile')
export class ConfigDarkModeApiMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IDarkModeConfiguration, DarkModeConfigurationViewModel>(
        mapper,
        'IDarkModeConfiguration',
        'DarkModeConfigurationViewModel',
      );
    };
  }
}

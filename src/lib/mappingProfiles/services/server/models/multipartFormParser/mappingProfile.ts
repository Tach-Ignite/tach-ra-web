import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@jersmart/automapper-core';
import formidable from 'formidable';
import { FileLike, ITachMappingProfile } from '@/lib/abstractions';
import { TachMappingProfileClass } from '@/lib/mapping';

@TachMappingProfileClass('lib/utils/multipartFormParser/mappingProfile')
export class FormidableMultipartFormParserProfile
  implements ITachMappingProfile
{
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<formidable.File, FileLike>(
        mapper,
        'formidable.File',
        'FileLike',
        forMember(
          (d) => d.name,
          mapFrom((s) => s.originalFilename),
        ),
        forMember(
          (d) => d.type,
          mapFrom((s) => s.mimetype),
        ),
        forMember(
          (d) => d.filepath,
          mapFrom((s) => s.filepath),
        ),
      );
    };
  }
}

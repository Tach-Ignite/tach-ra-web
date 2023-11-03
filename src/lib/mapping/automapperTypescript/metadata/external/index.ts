import { PojosMetadataMap } from '@jersmart/automapper-pojos';

export function createExternalMetadata() {
  PojosMetadataMap.create('formidable.File', {
    mimetype: String,
    originalFilename: String,
    filepath: String,
    size: Number,
  });
}

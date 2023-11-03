import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import {
  FileLike,
  IFileMetadata,
  RecaptchaValidationResponse,
} from '@/lib/abstractions';

export const fileMetadataMetadata = {
  filename: String,
  size: Number,
  uploadDate: Date,
  contentType: String,
};

export const fileLikeMetadata = {
  name: String,
  size: Number,
  type: String,
  filePath: String,
};

export function createServiceMetadata() {
  PojosMetadataMap.create<IFileMetadata>('IFileMetadata', fileMetadataMetadata);
  PojosMetadataMap.create<RecaptchaValidationResponse>(
    'RecaptchaValidationResponse',
    {
      success: Boolean,
      challengeTimestamp: String,
      hostname: String,
      errorCodes: [String],
    },
  );
  PojosMetadataMap.create<FileLike>('FileLike', fileLikeMetadata);
}

import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { BaseModel, IdModel, TimeStampedModel } from '@/lib/abstractions';

export const idModelMetadata = {
  _id: String,
};

export const timeStampedModelMetadata = {
  createdAt: Date,
  updatedAt: Date,
};

export const baseModelMetadata = {
  ...idModelMetadata,
  ...timeStampedModelMetadata,
};

export function createBaseModelMetadata() {
  PojosMetadataMap.create<IdModel>('IdModel', idModelMetadata);

  PojosMetadataMap.create<TimeStampedModel>(
    'TimeStampedModel',
    timeStampedModelMetadata,
  );

  PojosMetadataMap.create<BaseModel>('BaseModel', baseModelMetadata);
}

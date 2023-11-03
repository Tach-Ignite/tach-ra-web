import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import {
  DeleteResponse,
  InsertResponse,
  QueryOptions,
  UpdateResponse,
} from '@/lib/abstractions';

export function createDataProviderMetadata() {
  PojosMetadataMap.create<QueryOptions>('QueryOptions', {
    skip: Number,
    limit: Number,
  });
  PojosMetadataMap.create<InsertResponse>('InsertResponse', {
    insertedIds: [String],
  });
  PojosMetadataMap.create<UpdateResponse>('UpdateResponse', {
    updatedIds: [String],
    matchedCount: Number,
    modifiedCount: Number,
  });
  PojosMetadataMap.create<DeleteResponse>('DeleteResponse', {
    deletedIds: [String],
  });
}

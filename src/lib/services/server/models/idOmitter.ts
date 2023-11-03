import { IIdOmitter, IdModel } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('idOmitter')
export class IdOmitter implements IIdOmitter {
  omitId<T extends Partial<IdModel>>(model: T): Omit<T, '_id'> {
    const { _id, ...rest } = model;
    return rest;
  }
}

import { forMember, mapFrom } from '@jersmart/automapper-core';
import { WithId } from '@/lib/abstractions';

export const forMemberId = forMember<WithId<any>, WithId<any>>(
  (d) => d._id,
  mapFrom((s) => s._id),
);

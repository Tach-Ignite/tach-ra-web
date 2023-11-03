import { IEnum, IEnumFactory } from '@/lib/abstractions';
import { Enum } from './enum';

export class EnumFactory implements IEnumFactory {
  create<T extends IEnum>(enumValues: Object): T {
    return new Enum(enumValues) as unknown as T;
  }
}

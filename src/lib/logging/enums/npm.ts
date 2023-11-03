import { INpmLoggingLevels } from '@/lib/abstractions';
import { EnumFactory } from '@/lib/enums';

const enumFactory = new EnumFactory();
export const NpmLoggingLevels = enumFactory.create<INpmLoggingLevels>({
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
});

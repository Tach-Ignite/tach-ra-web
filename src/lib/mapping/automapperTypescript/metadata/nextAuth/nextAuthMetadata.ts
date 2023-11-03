import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { SessionOptions } from 'next-auth';
import { Credentials } from '@/lib/abstractions';

export const credentialsMetadata = {
  email: String,
  password: String,
};

export const sessionOptionsMetadata = {
  strategy: Object,
  maxAge: Number,
  updateAge: Number,
};

export function createNextAuthMetadata() {
  PojosMetadataMap.create<Credentials>('Credentials', credentialsMetadata);
  PojosMetadataMap.create<SessionOptions>(
    'SessionOptions',
    sessionOptionsMetadata,
  );
}

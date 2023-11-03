import { createBaseModelMetadata } from './baseModelMetadata';
import { createLibCommandPayloadMetadata } from './commands';
import { createTachConfigurationMetadata } from './configuration/configurationMetadata';
import { createDataProviderMetadata } from './data';
import { createExternalMetadata } from './external';
import {
  createPaymentMetadata,
  createStripePaymentMetadata,
  createPaypalPaymentMetadata,
} from './payment';
import { createServiceMetadata } from './services';

export function createLibMetadata() {
  createExternalMetadata();
  createBaseModelMetadata();
  createTachConfigurationMetadata();
  createDataProviderMetadata();
  createServiceMetadata();
  createPaymentMetadata();
  createStripePaymentMetadata();
  createPaypalPaymentMetadata();
  createLibCommandPayloadMetadata();
}

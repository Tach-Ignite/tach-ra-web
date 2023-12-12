import { createCommandMetadata } from './commands';
import { createDomainMetadata } from './domain';
import { createDtoMetadata } from './dtos/shared';
import { createViewModelMetadata } from './viewModels/shared';

// The order in which these metadata are created matters. dependencies must be created before referencing them.
export function createModelMetadata() {
  createDtoMetadata();
  createDomainMetadata();
  createViewModelMetadata();
  createCommandMetadata();
}

import { createCommandMetadata } from './commands';
import { createDomainMetadata } from './domain';
import { createDtoMetadata } from './dtos';
import { createViewModelMetadata } from './viewModels';

// The order in which these metadata are created matters. dependencies must be created before referencing them.
export function createModelMetadata() {
  createDtoMetadata();
  createDomainMetadata();
  createViewModelMetadata();
  createCommandMetadata();
}

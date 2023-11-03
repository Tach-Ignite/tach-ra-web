import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import {
  IFactory,
  IMapper,
  IMappingProfileRegistry,
  IProvider,
} from '@/lib/abstractions';
import { DependencyRegistry } from '@/lib/ioc/dependencyRegistry';

// TODO: There is an swc/next bug that causes this to fail with any class that has a static member:
// Module not found: Can't resolve '@swc/helpers/_/_identity'
// @Injectable('automapperProvider', 'automapperFactory', 'mappingProfileRegistry')
class AutomapperProvider implements IProvider<IMapper> {
  private static _mapper: IMapper;

  private _automapperFactory: IFactory<IMapper>;

  private _mappingProfileCollection: IMappingProfileRegistry;

  constructor(
    automapperFactory: IFactory<IMapper>,
    mappingProfileCollection: IMappingProfileRegistry,
  ) {
    this._automapperFactory = automapperFactory;
    this._mappingProfileCollection = mappingProfileCollection;
  }

  provide(): IMapper {
    if (
      !AutomapperProvider._mapper ||
      process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD ||
      this._mappingProfileCollection.isDirty
    ) {
      AutomapperProvider._mapper = this._automapperFactory.create();
    }
    return AutomapperProvider._mapper;
  }
}

// The workaround for the swc/next bug is to manually implement the @Injectable decorator logic:
const dependencyRegistry = new DependencyRegistry();
dependencyRegistry.registerNode('automapperProvider', AutomapperProvider, [
  'automapperFactory',
  'mappingProfileRegistry',
]);

export { AutomapperProvider };

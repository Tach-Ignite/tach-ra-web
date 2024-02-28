import { ModuleResolver } from '@/lib/ioc';
import { ConfigureModule } from './configure.module';
import { Configurator } from './configurator';
import { DependencyRegistry } from '@/lib/ioc/dependencyRegistry';

const dependencyRegistry = new DependencyRegistry();
dependencyRegistry.registerModule(ConfigureModule);
const m = new ModuleResolver().resolve(ConfigureModule);
const configurator = m.resolve<Configurator>('configurator');

if (process.argv.length === 3) {
  const serviceCode = process.argv[2];
  configurator.configure(serviceCode);
} else {
  configurator.configureAll();
}

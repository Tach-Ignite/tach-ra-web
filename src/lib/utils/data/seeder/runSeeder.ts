import { ModuleResolver } from '@/lib/ioc/';
import { DependencyRegistry } from '@/lib/ioc/dependencyRegistry';
import { ISeeder } from './abstractions';
import { SeederModule } from './seeder.module';

let env = 'local';
if (process.argv.length === 4 && process.argv[2] === '--env') {
  [, , , env] = process.argv;
}

const dependencyRegistry = new DependencyRegistry();
dependencyRegistry.registerModule(SeederModule);
const m = new ModuleResolver().resolve(SeederModule);
const seeder = m.resolve<ISeeder>('seeder', { env });
seeder.seed().then(() => {
  console.log('Data seeding complete.');
  process.exit();
});

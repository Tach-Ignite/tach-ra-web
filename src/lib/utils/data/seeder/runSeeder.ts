import dotenv from 'dotenv';

import fs from 'fs';

import { ModuleResolver } from '@/lib/ioc/';
import { DependencyRegistry } from '@/lib/ioc/dependencyRegistry';
import { getTachConfig } from '../../getTachConfig';
import { ISeeder } from './abstractions';
import { SeederModule } from './seeder.module';

let env = 'local';
if (process.argv.length === 4 && process.argv[2] === '--env') {
  [, , , env] = process.argv;
}

dotenv.config({
  path: `${process.cwd()}/.env.${env}`,
});

let rawSecrets = {};
let secrets = '{}';
const config = getTachConfig();
if (
  config.secrets.provider === 'env' &&
  process.env.NODE_ENV !== 'production'
) {
  const f = fs.readFileSync(`./.env.secrets.${env}`);
  rawSecrets = dotenv.parse(f);
  secrets = JSON.stringify(rawSecrets);
}
process.env.secrets = secrets;

const dependencyRegistry = new DependencyRegistry();
dependencyRegistry.registerModule(SeederModule);
const m = new ModuleResolver().resolve(SeederModule);
const seeder = m.resolve<ISeeder>('seeder', { env });
seeder
  .seed()
  .then(() => {
    console.log('Data seeding complete.');
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

import { ModuleResolver } from '@/lib/ioc';
import { DependencyRegistry } from '@/lib/ioc/dependencyRegistry';
import { ConfigureModule } from './configure.module';
import { IConfigurator } from './abstractions/iConfigurator';

const dependencyRegistry = new DependencyRegistry();
dependencyRegistry.registerModule(ConfigureModule);
const m = new ModuleResolver().resolve(ConfigureModule);
const configurator = m.resolve<IConfigurator>('configurator');

const helpMessage = `\tThis CLI tool is used to assist in configuring the application along with any service providers used.
\ttach-cli <command>

\tUsage

\ttach-cli configure         Configure all services within the application
\ttach-cli configure <foo>   Configure <foo> within the application
\ttach-cli help              Display this help message
\ttach-cli help <command>    Display help for <command>
`;

if (process.argv.length === 2) {
  console.log(helpMessage);
} else if (process.argv.length === 3) {
  const command = process.argv[2];
  if (command === 'help') {
    console.log(helpMessage);
  } else if (command === 'configure') {
    configurator.configureAll();
  }
} else if (process.argv.length === 4) {
  const command = process.argv[2];
  const secondaryCommand = process.argv[3];
  if (command === 'help' && secondaryCommand === 'configure') {
    // provide help for configure command
    configurator.help();
  } else if (command === 'configure') {
    configurator.configure(secondaryCommand);
  }
} else if (process.argv.length === 5) {
  const command = process.argv[2];
  const secondaryCommand = process.argv[3];
  const tertiaryCommand = process.argv[4];
  if (command === 'help' && secondaryCommand === 'configure') {
    configurator.help(tertiaryCommand);
  }
} else {
  configurator.configureAll();
}

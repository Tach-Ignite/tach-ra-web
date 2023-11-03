import { ILoggerFactory, INpmLogger } from '@/lib/abstractions';
import { ModuleResolver } from '@/lib/ioc/';
import { LoggingModule } from '@/lib/modules/logging/logging.module';

function LoggingTestPage() {
  return <div>Check the logs on the server.</div>;
}

export async function getServerSideProps() {
  const m = new ModuleResolver().resolve(LoggingModule);
  const loggerFactory = m.resolve<ILoggerFactory<INpmLogger>>('loggerFactory');
  const logger = await loggerFactory.create('test.logging');
  logger.debug('debug log message', { extraData: 'extra data' });
  logger.error('error log message', { extraData: 'extra data' });
  logger.http('http log message', { extraData: 'extra data' });
  logger.verbose('verbose log message', { extraData: 'extra data' });
  logger.log('error', 'log message', { extraData: 'extra data' });
  logger.warn('warn log message', { extraData: 'extra data' });
  logger.silly('silly log message', { extraData: 'extra data' });
  logger.info('info log message', { extraData: 'extra data' });

  return { props: {} };
}

export default LoggingTestPage;

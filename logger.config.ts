import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
// import WinstonCloudwatch from 'winston-cloudwatch';
import { TransportTargetOptions, transport } from 'pino';
import tachConfig from '~/tach.config';
import { npmLevels } from '@/lib/logging/pino/npmLevels';
import { SecretsProviderFactory } from '@/lib/services/server/security/secretsProviderFactory';
import { Module, ModuleClass, ModuleResolver } from '@/lib/ioc';
import { SecretsModule } from '@/lib/modules/services/server/security/secrets.module';

@Module
class GetLoggingConfigModule extends ModuleClass {
  constructor() {
    super({
      imports: [SecretsModule],
      providers: [],
    });
  }
}

export async function getLoggingConfig() {
  const module = new ModuleResolver().resolve(GetLoggingConfigModule);
  const secretsProviderFactory = module.resolve<SecretsProviderFactory>(
    'secretsProviderFactory',
  );
  const secretsProvider = await secretsProviderFactory.create();
  const awsSecretAccessKey = (await secretsProvider.provide(
    'TACH_AWS_SECRET_ACCESS_KEY',
  ))!;

  // winston
  // const fileLogTransport = new transports.DailyRotateFile({
  //   filename: `./logs/${process.env.TACH_APPLICATION_NAME}-%DATE%.log`,
  //   datePattern: 'YYYY-MM-DD',
  //   zippedArchive: true,
  //   maxSize: '20m',
  //   maxFiles: '14d',
  // });

  const consoleLogTransport = new transports.Console({
    level: process.env.LOG_LEVEL,
    handleExceptions: false,
    format: format.printf((info) => `${info.message}`),
  });

  // const cloudwatchTransport = new WinstonCloudwatch({
  //   level: 'error',
  //   logGroupName: 'TachStore',
  //   logStreamName: 'errors',
  //   awsRegion: process.env.TACH_AWS_REGION,
  //   awsOptions: {
  //     credentials: {
  //       accessKeyId: process.env.TACH_AWS_ACCESS_KEY_ID!,
  //       secretAccessKey: awsSecretAccessKey,
  //     },
  //   },
  // });

  const t = [];
  // t.push(fileLogTransport);
  // t.push(cloudwatchTransport);

  if (process.env.NODE_ENV !== 'production') {
    t.push(consoleLogTransport);
  }

  const winstonConfig = {
    level: 'silly',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.colorize(),
      format.json(),
      format.printf(
        ({ level, message, label = process.env.NODE_ENV, timestamp }) =>
          `${timestamp} [${label}] ${level}: ${message}`,
      ),
    ),
    defaultMeta: { service: process.env.TACH_APPLICATION_NAME },
    transports: t,
  };

  // pino
  const pinoCloudwatchTarget = {
    target: '@serdnam/pino-cloudwatch-transport',
    level: 'error',
    options: {
      logGroupName: 'TachStore',
      logStreamName: 'errors',
      awsRegion: process.env.TACH_AWS_REGION,
      awsAccessKeyId: process.env.TACH_AWS_ACCESS_KEY_ID,
      awsSecretAccessKey,
      interval: 1_000, // this is the default
    },
  };

  const pinoConsoleTarget = {
    target: 'pino-pretty',
    level: 'silly',
    options: {
      colorize: true,
    },
  };

  const pinoTransports: TransportTargetOptions[] = [];
  pinoTransports.push(pinoCloudwatchTarget);

  if (process.env.NODE_ENV !== 'production') {
    pinoTransports.push(pinoConsoleTarget);
  }

  const pinoConfig = [
    {
      level: 'silly',
      customLevels: npmLevels,
    },
    transport({
      targets: pinoTransports,

      levels: npmLevels,
    }),
  ];

  let configTemp;
  switch (tachConfig.logging.provider) {
    case 'pino':
      configTemp = pinoConfig;
      break;
    case 'winston':
      configTemp = winstonConfig;
      break;
    default:
      throw new Error('Invalid logging provider');
  }
  const config = configTemp;

  return config;
}

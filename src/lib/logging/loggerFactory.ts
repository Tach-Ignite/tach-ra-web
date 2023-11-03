import { createLogger } from 'winston';
import pino from 'pino';
import {
  ILoggerFactory,
  ILoggingConfiguration,
  INpmLogger,
  IOptions,
} from '@/lib/abstractions';
import { getLoggingConfig } from '~/logger.config';
import { WinstonLogger } from './winston';
import { PinoLogger } from './pino';
import { Injectable } from '../ioc/injectable';

@Injectable('loggerFactory', 'loggingConfigurationOptions')
export class LoggerFactory implements ILoggerFactory<INpmLogger> {
  private _loggingConfiguration: ILoggingConfiguration;

  constructor(loggingConfigurationOptions: IOptions<ILoggingConfiguration>) {
    this._loggingConfiguration = loggingConfigurationOptions.value;
  }

  createPinoLogger(config: any, namespace: string): PinoLogger {
    if (Array.isArray(config.default)) {
      const pinoLogger: any = pino(...config.default);
      return new PinoLogger(pinoLogger, namespace);
    }
    const pinoLogger: any = pino(config.default);
    return new PinoLogger(pinoLogger, namespace);
  }

  createWinstonLogger(config: any, namespace: string): WinstonLogger {
    const winstonLogger = createLogger(config.default);
    return new WinstonLogger(winstonLogger, namespace);
  }

  async create(namespace: string): Promise<INpmLogger> {
    const config: any = await getLoggingConfig();
    switch (this._loggingConfiguration.provider) {
      case 'winston':
        return this.createWinstonLogger(config, namespace);
      case 'pino':
        return this.createPinoLogger(config, namespace);
      default:
        throw new Error(
          `Logging provider ${this._loggingConfiguration.provider} is not supported.`,
        );
    }
  }
}

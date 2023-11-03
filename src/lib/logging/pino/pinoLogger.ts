import { Logger, LoggerOptions } from 'pino';
import { INpmLogger } from '@/lib/abstractions';

export class PinoLogger implements INpmLogger {
  private _logger;

  constructor(
    logger: Logger<
      LoggerOptions & {
        customLevels: {
          silly: number;
          verbose: number;
          http: number;
        };
      }
    >,
    namespace: string,
  ) {
    this._logger = logger.child({ namespace });
  }

  error(message: string, ...metadata: any[]): void {
    this._logger.error(message, ...metadata);
  }

  warn(message: string, ...metadata: any[]): void {
    this._logger.warn(message, ...metadata);
  }

  info(message: string, ...metadata: any[]): void {
    this._logger.info(message, ...metadata);
  }

  http(message: string, ...metadata: any[]): void {
    this._logger.http(message, ...metadata);
  }

  verbose(message: string, ...metadata: any[]): void {
    this._logger.verbose(message, ...metadata);
  }

  debug(message: string, ...metadata: any[]): void {
    this._logger.debug(message, ...metadata);
  }

  silly(message: string, ...metadata: any[]): void {
    this._logger.silly(message, ...metadata);
  }

  log(level: string, message: string, ...metadata: any[]): void {
    (this._logger as any)[level](message, ...metadata);
  }
}

import { Logger } from 'winston';
import { INpmLogger } from '@/lib/abstractions';

export class WinstonLogger implements INpmLogger {
  private _logger: Logger;

  constructor(logger: Logger, namespace: string) {
    this._logger = logger;
    this._logger.defaultMeta = { ...this._logger.defaultMeta, namespace };
  }

  log(level: string, message: string, ...metadata: any[]): void {
    this._logger.log(level, message, ...metadata);
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
}

import crypto from 'crypto';
import { Readable } from 'stream';
import got from 'got';
import {
  IFileMetadata,
  IFileStorageService,
  ILoggerFactory,
  INpmLogger,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('dummyFileStorageService', 'loggerFactory')
export class DummyFileStorageService implements IFileStorageService {
  private _loggerFactory: ILoggerFactory<INpmLogger>;

  constructor(loggerFactory: ILoggerFactory<INpmLogger>) {
    this._loggerFactory = loggerFactory;
  }

  async uploadFile(): Promise<string> {
    return crypto.randomUUID();
  }

  async deleteFile(key: string): Promise<void> {
    const logger = await this._loggerFactory.create(
      'src/lib/services/server/fileStorage/dummyFileStorage',
    );
    logger.info('dummy file deleted.');
  }

  async getSignedUrl(key: string): Promise<string> {
    const seed = crypto.randomUUID().replace(/-/g, '');

    return `https://picsum.photos/seed/${seed}/300/300`;
  }

  async getDownloadStream(key: string): Promise<Readable> {
    const seed = crypto.randomUUID().replace(/-/g, '');
    return Promise.resolve(
      Readable.from(got.stream(`https://picsum.photos/seed/${seed}/300/300`)),
    );
  }

  async getFileMetadata(key: string): Promise<IFileMetadata> {
    return Promise.resolve({
      filename: key,
      size: 123,
      uploadDate: new Date(),
      contentType: 'image/jpeg',
    } as IFileMetadata);
  }
}

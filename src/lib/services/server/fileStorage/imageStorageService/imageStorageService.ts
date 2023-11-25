import path from 'path';
import {
  IFactory,
  IPublicFileStorageService,
  IImageStorageService,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('imageStorageService', 'fileStorageServiceFactory')
export class ImageStorageService implements IImageStorageService {
  private _fileStorageServiceFactory: IFactory<IPublicFileStorageService>;

  constructor(fileStorageServiceFactory: IFactory<IPublicFileStorageService>) {
    this._fileStorageServiceFactory = fileStorageServiceFactory;
  }

  async uploadImage(
    fileName: string,
    file: Blob,
    contentType: string,
  ): Promise<string> {
    const storageService = this._fileStorageServiceFactory.create();
    const regex = '^image/(jpeg|gif|png|webp)$';
    if (!contentType.match(regex)) {
      throw new Error('Invalid file type. must be jpeg, gif, png, or webp.');
    }

    const extension = this.getFileExtension(fileName, contentType);
    if (!fileName.endsWith(extension)) {
      fileName = `${fileName}.${extension}`;
    }

    fileName = path.join('images', fileName);
    await storageService.uploadFile(fileName, file, contentType);

    return fileName;
  }

  private getFileExtension(fileName: string, contentType: string): string {
    const splitFilename = fileName.split('.');
    const splitContentType = contentType.split('/');
    return splitFilename.length > 1
      ? splitFilename[splitFilename.length - 1]
      : splitContentType[splitContentType.length - 1];
  }
}

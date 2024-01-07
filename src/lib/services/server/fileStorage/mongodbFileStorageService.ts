import { Readable, pipeline } from 'stream';
import { promisify } from 'util';
import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import {
  IFactory,
  IPublicFileStorageService,
  IFileMetadata,
} from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { Injectable } from '@/lib/ioc/injectable';
import clientPromise from '@/lib/services/server/data/providers/mongodb/mongoDbClientPromise';

@Injectable(
  'mongodbFileStorageService',
  // 'mongoClientFactory'
)
export class MongodbFileStorageService implements IPublicFileStorageService {
  // private _mongoClientFactory: IFactory<Promise<MongoClient>>;

  private _pipeline: any;

  private _bucketName: string;

  constructor() {
    // mongoClientFactory: IFactory<Promise<MongoClient>>
    // this._mongoClientFactory = mongoClientFactory;
    this._bucketName = 'files';
    this._pipeline = promisify(pipeline);
  }

  async uploadFile(
    fileName: string,
    file: Blob,
    contentType: string,
  ): Promise<string> {
    const client = await clientPromise;
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: this._bucketName });
    const uploadStream = bucket.openUploadStream(fileName, {
      metadata: { contentType },
    });
    const objectId = new ObjectId(uploadStream.id.toString());

    await this._pipeline(file.stream(), uploadStream);
    return objectId.toString();
  }

  async deleteFile(key: string): Promise<void> {
    const client = await clientPromise;
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: this._bucketName });
    const file = await bucket.find({ filename: key }).toArray();

    if (!file || file.length === 0) {
      throw new ErrorWithStatusCode(
        `File with key ${key} not found to delete.`,
        404,
      );
    }

    await bucket.delete(new ObjectId(file[0]._id));
  }

  async getPublicUrl(key: string): Promise<string> {
    return `${process.env.NEXT_PUBLIC_API_URL}/static/${key}`;
  }

  async getDownloadStream(key: string): Promise<Readable> {
    const client = await clientPromise;
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: this._bucketName });

    const downloadStream = bucket.openDownloadStreamByName(key);
    return downloadStream;
  }

  async getFileMetadata(key: string): Promise<IFileMetadata> {
    const client = await clientPromise;
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: this._bucketName });
    const file = await (await bucket.find({ filename: key })).toArray();
    if (!file) {
      throw new Error('File not found.');
    }

    return {
      filename: file[0].filename,
      size: file[0].length,
      uploadDate: file[0].uploadDate,
      contentType: file[0].metadata!.contentType,
    } as IFileMetadata;
  }
}

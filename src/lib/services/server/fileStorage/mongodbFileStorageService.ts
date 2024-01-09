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
// import clientPromise from '@/lib/services/server/data/providers/mongodb/mongoDbClientPromise';

@Injectable(
  'mongodbFileStorageService',
  'mongoClientFactory',
  'connectionMethodology',
)
export class MongodbFileStorageService implements IPublicFileStorageService {
  private _clientFactory: IFactory<Promise<MongoClient>>;

  private _connectionMethodology: 'factory'; // | module;

  private _pipeline: any;

  private _bucketName: string;

  constructor(
    mongoClientFactory: IFactory<Promise<MongoClient>>,
    connectionMethodology: 'factory' = 'factory', // | 'module'
  ) {
    this._clientFactory = mongoClientFactory;
    this._connectionMethodology = connectionMethodology;
    this._bucketName = 'files';
    this._pipeline = promisify(pipeline);
  }

  private async getClient(): Promise<MongoClient> {
    switch (this._connectionMethodology) {
      // case 'module':
      //   return clientPromise;
      case 'factory':
        return this._clientFactory.create();
      default:
        throw new Error(
          `Invalid connection methodology: ${this._connectionMethodology}`,
        );
    }
  }

  async uploadFile(
    fileName: string,
    file: Blob,
    contentType: string,
  ): Promise<string> {
    const client = await this.getClient();
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
    const client = await this.getClient();
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
    const client = await this.getClient();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: this._bucketName });

    const downloadStream = bucket.openDownloadStreamByName(key);
    return downloadStream;
  }

  async getFileMetadata(key: string): Promise<IFileMetadata> {
    const client = await this.getClient();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: this._bucketName });
    const files = await (await bucket.find({ filename: key })).toArray();
    if (!files || files.length === 0) {
      throw new ErrorWithStatusCode('File not found.', 404);
    }

    return {
      filename: files[0].filename,
      size: files[0].length,
      uploadDate: files[0].uploadDate,
      contentType: files[0].metadata!.contentType,
    } as IFileMetadata;
  }
}

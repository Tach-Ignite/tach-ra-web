import { Readable } from 'stream';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  IAsyncMultiProvider,
  IFactory,
  IFileMetadata,
  IPublicFileStorageService,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('s3FileStorageService', 'secretsProviderFactory')
export class S3FileStorageService implements IPublicFileStorageService {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._secretsProvider = secretsProviderFactory.create();
  }

  async uploadFile(
    fileName: string,
    file: Blob,
    contentType: string,
  ): Promise<string> {
    const awsSecretAccessKey = (await this._secretsProvider.provide(
      'TACH_AWS_SECRET_ACCESS_KEY',
    ))!;
    const s3Client = new S3Client({
      region: process.env.TACH_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.TACH_AWS_ACCESS_KEY_ID!,
        secretAccessKey: awsSecretAccessKey,
      },
    });
    const arrayBuffer: ArrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.TACH_AWS_BUCKET_NAME!,
      Key: fileName,
      Body: Buffer.from(arrayBuffer),
      ContentType: contentType,
    });
    const result = await s3Client.send(command);
    return result.ETag!;
  }

  async deleteFile(key: string): Promise<void> {
    const awsSecretAccessKey = (await this._secretsProvider.provide(
      'TACH_AWS_SECRET_ACCESS_KEY',
    ))!;
    const s3Client = new S3Client({
      region: process.env.TACH_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.TACH_AWS_ACCESS_KEY_ID!,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    const command = new DeleteObjectCommand({
      Bucket: process.env.TACH_AWS_BUCKET_NAME!,
      Key: key,
    });
    await s3Client.send(command);
  }

  async getPublicUrl(key: string): Promise<string> {
    const url = new URL(
      `https://${process.env.TACH_AWS_BUCKET_NAME!}.s3.amazonaws.com/${key}`,
    );
    return url.toString();
  }

  async getSignedUrl(key: string): Promise<string> {
    const awsSecretAccessKey = (await this._secretsProvider.provide(
      'TACH_AWS_SECRET_ACCESS_KEY',
    ))!;
    const s3Client = new S3Client({
      region: process.env.TACH_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.TACH_AWS_ACCESS_KEY_ID!,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.TACH_AWS_BUCKET_NAME!,
      Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  async getDownloadStream(key: string): Promise<Readable> {
    const awsSecretAccessKey = (await this._secretsProvider.provide(
      'TACH_AWS_SECRET_ACCESS_KEY',
    ))!;
    const s3Client = new S3Client({
      region: process.env.TACH_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.TACH_AWS_ACCESS_KEY_ID!,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.TACH_AWS_BUCKET_NAME!,
      Key: key,
    });
    const result = await s3Client.send(command);
    return Readable.from(await result.Body!.transformToByteArray());
  }

  async getFileMetadata(key: string): Promise<IFileMetadata> {
    const awsSecretAccessKey = (await this._secretsProvider.provide(
      'TACH_AWS_SECRET_ACCESS_KEY',
    ))!;
    const s3Client = new S3Client({
      region: process.env.TACH_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.TACH_AWS_ACCESS_KEY_ID!,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    const command = new HeadObjectCommand({
      Bucket: process.env.TACH_AWS_BUCKET_NAME!,
      Key: key,
    });
    const result = await s3Client.send(command);
    return {
      filename: key,
      size: result.ContentLength!,
      uploadDate: result.LastModified!,
      contentType: result.ContentType!,
    };
  }
}

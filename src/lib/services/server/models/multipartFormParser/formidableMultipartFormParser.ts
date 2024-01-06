import type { NextApiRequest } from 'next';
import formidable from 'formidable';
import {
  FileLike,
  MultipartFormParserResult,
  IFormParser,
  IMapper,
  IProvider,
} from '@/lib/abstractions';
import '@/lib/mappingProfiles/services/server/models/multipartFormParser/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('formParser', 'automapperProvider')
export class FormidableFormParser implements IFormParser {
  private _automapperProvider: IProvider<IMapper>;

  constructor(automapperProvider: IProvider<IMapper>) {
    this._automapperProvider = automapperProvider;
  }

  async getRawBody(req: NextApiRequest): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      req.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      req.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      req.on('error', reject);
    });
  }

  async parseJsonForm<TResult>(req: NextApiRequest): Promise<TResult> {
    const bodyParserPromise = await new Promise<string>((resolve, reject) => {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const data = body;
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    });
    return JSON.parse(bodyParserPromise) as TResult;
  }

  async parseMultipartForm(
    req: NextApiRequest,
  ): Promise<MultipartFormParserResult> {
    const formidableResult: {
      fields: formidable.Fields;
      files: formidable.Files;
    } = await new Promise((resolve, reject) => {
      const form = formidable();

      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) reject(err);
        else {
          // Replace empty string values with undefined
          Object.keys(fields).forEach((key) => {
            if (fields[key] === '' || fields[key] === 'undefined') {
              fields[key] = [undefined];
            }
          });

          resolve({ fields, files });
        }
      });
    });

    const fields: { [key: string]: string } = {};
    Object.keys(formidableResult.fields).forEach((key) => {
      [fields[key]] = formidableResult.fields[key];
    });

    const files: { [key: string]: FileLike } = {};
    const mapper = this._automapperProvider.provide();
    Object.keys(formidableResult.files).forEach((key) => {
      const formidableFileOrArray = formidableResult.files[key];
      const formidableFile = Array.isArray(formidableFileOrArray)
        ? formidableFileOrArray[0]
        : formidableFileOrArray;
      files[key] = mapper.map<formidable.File, FileLike>(
        formidableFile,
        'formidable.File',
        'FileLike',
      );
    });

    return { fields, files };
  }
}

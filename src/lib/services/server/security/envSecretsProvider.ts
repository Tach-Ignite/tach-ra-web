import { IAsyncMultiProvider } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';

@Injectable('envSecretsProvider')
export class EnvSecretsProvider
  implements IAsyncMultiProvider<string | undefined>
{
  private _secrets: { [key: string]: string | undefined };

  constructor() {
    const secretsString = process.env.secrets;
    if (!secretsString) {
      this._secrets = {};
    } else {
      this._secrets = JSON.parse(secretsString);
    }
  }

  async provideAll(): Promise<{ [key: string]: string | undefined }> {
    return this._secrets;
  }

  async provide(key: string): Promise<string | undefined> {
    return this._secrets[key] || process.env[key];
  }
}

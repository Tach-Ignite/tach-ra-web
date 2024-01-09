import { IAsyncMultiProvider } from '@/lib/abstractions';
import { DependencyRegistry } from '@/lib/ioc/dependencyRegistry';
import {
  GetParameterCommand,
  SSMClient,
  ParameterNotFound,
} from '@aws-sdk/client-ssm';

// TODO: There is an swc/next bug that causes this to fail with any class that has a static member:
// Module not found: Can't resolve '@swc/helpers/_/_identity'
// @Injectable('ssmSecretsProvider')
class SsmSecretsProvider implements IAsyncMultiProvider<string | undefined> {
  private static _secrets: { [key: string]: string | undefined } = {};

  private static _checked: { [key: string]: boolean } = {};

  private __client?: SSMClient;

  private get _client(): SSMClient {
    if (!this.__client) {
      this.__client = new SSMClient({
        region: process.env.TACH_AWS_REGION,
      });
    }
    return this.__client;
  }

  private __prefix?: string;

  private get _prefix(): string {
    if (!this.__prefix) {
      this.__prefix = `/sst/${process.env.TACH_SST_APP_NAME}/${process.env.TACH_SST_STAGE}/Secret/`;
    }
    return this.__prefix;
  }

  async provideAll(): Promise<{ [key: string]: string | undefined }> {
    return SsmSecretsProvider._secrets;
  }

  async provide(key: string): Promise<string | undefined> {
    if (!key) {
      return undefined;
    }

    if (SsmSecretsProvider._checked[key]) {
      return SsmSecretsProvider._secrets[key] || process.env[key];
    }
    const command = new GetParameterCommand({
      Name: `${this._prefix}${key}/value`,
      WithDecryption: true,
    });
    try {
      const response = await this._client.send(command);
      SsmSecretsProvider._secrets[key] = response.Parameter?.Value;
    } catch (e) {
      console.log(`${this._prefix}${key}/value`);
      console.log(e);
      if (!(e instanceof ParameterNotFound)) {
        throw e;
      }
    }
    SsmSecretsProvider._checked[key] = true;
    return SsmSecretsProvider._secrets[key] || process.env[key];
  }
}

// The workaround for the swc/next bug is to manually implement the @Injectable decorator logic:
const dependencyRegistry = new DependencyRegistry();
dependencyRegistry.registerNode('ssmSecretsProvider', SsmSecretsProvider);

export { SsmSecretsProvider };

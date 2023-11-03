import jwt from 'jsonwebtoken';
import {
  IAsyncMultiProvider,
  IFactory,
  ITokenService,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('tokenService', 'secretsProviderFactory')
export class TokenService implements ITokenService {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._secretsProvider = secretsProviderFactory.create();
  }

  async createToken(
    id: string,
    email: string,
    expiresIn: string,
  ): Promise<string> {
    const secret = (await this._secretsProvider.provide(
      'TACH_NEXTAUTH_JWT_SECRET',
    ))!;
    return jwt.sign({ id }, secret + email, {
      expiresIn,
    });
  }

  async validateToken(token: string, email: string): Promise<boolean> {
    try {
      const secret = (await this._secretsProvider.provide(
        'TACH_NEXTAUTH_JWT_SECRET',
      ))!;
      const verify = jwt.verify(token, secret + email);
      return true;
    } catch (error) {
      return false;
    }
  }
}

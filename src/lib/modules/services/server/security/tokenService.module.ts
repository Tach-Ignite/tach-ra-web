import { Module, ModuleClass } from '@/lib/ioc';
import { TokenService } from '@/lib/services/server';
import { SecretsModule } from './secrets.module';

@Module
export class TokenServiceModule extends ModuleClass {
  constructor() {
    super({
      imports: [SecretsModule],
      providers: [
        {
          provide: 'tokenService',
          useClass: TokenService,
        },
      ],
    });
  }
}

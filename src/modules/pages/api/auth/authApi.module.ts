import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';

@Module
export class AuthApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [ApiModule, NextAuthModule],
      providers: [],
    });
  }
}

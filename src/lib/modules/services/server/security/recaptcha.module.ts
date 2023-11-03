import { Module, ModuleClass } from '@/lib/ioc';
import { RecaptchaValidator } from '@/lib/services/server';
import { SecretsModule } from './secrets.module';

@Module
export class RecaptchaModule extends ModuleClass {
  constructor() {
    super({
      imports: [SecretsModule],
      providers: [
        {
          provide: 'recaptchaValidator',
          useClass: RecaptchaValidator,
        },
      ],
    });
  }
}

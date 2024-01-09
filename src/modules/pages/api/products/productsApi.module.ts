import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { CommandsModule } from '@/lib/modules/commands/commands.module';
import { FormidableFormParser } from '@/lib/services/server/models/multipartFormParser/formidableMultipartFormParser';
import { ProductCommandsModule } from '@/modules/commands/products/productCommands.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { ProductServiceModule } from '@/modules/services/products/productService.module';

@Module
export class ProductsApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        ApiModule,
        AutomapperModule,
        CommandsModule,
        ProductServiceModule,
        NextAuthModule,
        ProductCommandsModule,
      ],
      providers: [
        {
          provide: 'formParser',
          useClass: FormidableFormParser,
        },
      ],
    });
  }
}

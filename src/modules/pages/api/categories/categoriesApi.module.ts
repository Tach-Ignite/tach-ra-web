import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { CommandsModule } from '@/lib/modules/commands/commands.module';
import { CategoryCommandsModule } from '@/modules/commands/categories/categoryCommands.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { CategoryServiceModule } from '@/modules/services/categories/categoryService.module';

@Module
export class CategoriesApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        ApiModule,
        AutomapperModule,
        CategoryServiceModule,
        NextAuthModule,
        CommandsModule,
        CategoryCommandsModule,
      ],
      providers: [],
    });
  }
}

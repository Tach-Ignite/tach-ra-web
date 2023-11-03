import {
  ConfirmCheckoutSessionCommand,
  CreatePaymentIntentCommand,
  ParseConfirmCheckoutSessionCommand,
} from '@/lib/commands/implementations/payment';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { CommandsModule } from '@/lib/modules/commands/commands.module';
import { PaymentServiceModule } from '@/lib/modules/services/server/payment/paymentService.module';
import { OrderCommandsModule } from '@/modules/commands/orders/orderCommands.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { UserServiceModule } from '@/modules/services/users/userService.module';

@Module
export class CheckoutApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        ApiModule,
        NextAuthModule,
        CommandsModule,
        UserServiceModule,
        AutomapperModule,
        OrderCommandsModule,
        PaymentServiceModule,
      ],
      providers: [
        {
          provide: 'createPaymentIntentCommand',
          useClass: CreatePaymentIntentCommand,
        },
        {
          provide: 'parseConfirmCheckoutSessionCommand',
          useClass: ParseConfirmCheckoutSessionCommand,
        },
        {
          provide: 'confirmCheckoutSessionCommand',
          useClass: ConfirmCheckoutSessionCommand,
        },
      ],
    });
  }
}

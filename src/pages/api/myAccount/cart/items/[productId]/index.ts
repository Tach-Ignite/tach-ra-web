import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { IMapper, IProvider, IServerIdentity } from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import { CartViewModel, ICart, RemoveItemFromCartViewModel } from '@/models';
import '@/mappingProfiles/pages/api/orders/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { ErrorWithStatusCode } from '@/lib/errors';
import { MyAccountCartApiModule } from '@/modules/pages/api/myAccount/cart/myAccountCartApi.module';
import { ICartService } from '@/abstractions/services/iCartService';

const m = new ModuleResolver().resolve(MyAccountCartApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const cartService = m.resolve<ICartService>('cartService');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { productId } = req.body as RemoveItemFromCartViewModel;

  const result = await cartService.removeItemFromCart(user._id, productId);

  if (result === undefined) {
    throw new ErrorWithStatusCode(
      'The set user profile command did not return a result.',
      500,
      'There was an error setting the user profile. Please try again later.',
    );
  }

  const cartViewModel = mapper.map<ICart, CartViewModel>(
    result,
    'ICart',
    'CartViewModel',
  );

  return res.status(200).json(cartViewModel);
});

export default router.handler(defaultHandler);

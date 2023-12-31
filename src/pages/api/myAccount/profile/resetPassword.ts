import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { IServerIdentity } from '@/lib/abstractions';
import { AuthenticatedProfileResetPasswordViewModel } from '@/models';
import '@/mappingProfiles/pages/api/users/mappingProfile';
import { defaultHandler } from '@/lib/api';
import { ModuleResolver } from '@/lib/ioc/';
import { ErrorWithStatusCode } from '@/lib/errors';
import { IUserService } from '@/abstractions';
import { MyAccountProfileApiModule } from '@/modules/pages/api/myAccount/profile/myAccountProfileApi.module';

const m = new ModuleResolver().resolve(MyAccountProfileApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const userService = m.resolve<IUserService>('userService');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);

  if (!user) {
    throw new ErrorWithStatusCode('Unauthorized', 401);
  }

  const resetPasswordViewModel: AuthenticatedProfileResetPasswordViewModel =
    req.body;

  await userService.authenticatedResetPassword(
    user._id,
    resetPasswordViewModel.currentPassword,
    resetPasswordViewModel.newPassword,
  );

  return res.status(204).end();
});

export default router.handler(defaultHandler);

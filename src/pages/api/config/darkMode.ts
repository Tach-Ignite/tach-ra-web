import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  IProvider,
  IMapper,
  IDarkModeConfiguration,
  IOptions,
} from '@/lib/abstractions';
import { DarkModeConfigurationViewModel } from '@/models';
import { defaultHandler } from '@/lib/api';
import '@/mappingProfiles/pages/api/config/darkMode/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { ConfigDarkModeApiModule } from '@/modules/pages/api/config/darkMode.module';

const m = new ModuleResolver().resolve(ConfigDarkModeApiModule);
const darkModeConfig = m.resolve<IOptions<IDarkModeConfiguration>>(
  'darkModeConfigurationOptions',
).value;
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  if (!darkModeConfig) {
    return res.status(204).end();
  }

  const darkModeConfigurationViewModel = mapper.map<
    IDarkModeConfiguration,
    DarkModeConfigurationViewModel
  >(darkModeConfig, 'IDarkModeConfiguration', 'DarkModeConfigurationViewModel');

  return res.status(200).json(darkModeConfigurationViewModel);
});

export default router.handler(defaultHandler);

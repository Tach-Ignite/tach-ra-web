import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { IFactory, IPublicFileStorageService } from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import { StaticApiModule } from '@/modules/pages/api/static/staticApi.module';
import { ModuleResolver } from '@/lib/ioc/';

const m = new ModuleResolver().resolve(StaticApiModule);
const fileStorageServiceFactory = m.resolve<
  IFactory<IPublicFileStorageService>
>('fileStorageServiceFactory');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const splitKey = req.query.key as string[];
    const joinedKey = splitKey.join('/');
    const fileStorageService = await fileStorageServiceFactory.create();
    const metadata = await fileStorageService.getFileMetadata(joinedKey);
    const readable = await fileStorageService.getDownloadStream(joinedKey);

    res.setHeader('Content-Type', metadata.contentType);

    return readable.pipe(res);
  } catch (err) {
    return defaultHandler.onError(err, req, res);
  }
});

export default router.handler(defaultHandler);

import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorWithStatusCode } from '@/lib/errors';
import { ILoggerFactory, INpmLogger } from '@/lib/abstractions';
import { ModuleResolver } from '@/lib/ioc';
import { ApiModule } from '@/lib/modules/api/api.module';

const m = new ModuleResolver().resolve(ApiModule);
const loggerFactory = m.resolve<ILoggerFactory<INpmLogger>>('loggerFactory');

export const defaultHandler = {
  onError: (err: unknown, req: NextApiRequest, res: NextApiResponse) => {
    const namespace = (err as any).namespace ?? '/src/lib/api/defaultHandler';
    loggerFactory.create(namespace).then((logger) => {
      const error = err as Error;
      let status = 500;
      let friendlyMessage = error.message;
      if (err instanceof ErrorWithStatusCode) {
        status = err.statusCode;
        friendlyMessage = err.friendlyMessage;
      }

      logger.error(error.message, status, error.stack);
      res.status(status).end(friendlyMessage);
    });
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'OPTIONS') {
      res.status(200).end();
    } else {
      res.status(404).end('Page is not found');
    }
  },
};

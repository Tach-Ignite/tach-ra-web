import { passwordProtectedMiddlewareFactory } from './middlewares/passwordProtectedMiddleware';
import { stackMiddlewares } from './lib/middlewares';
import { MiddlewareFactory } from './lib/abstractions';

const middlewares: MiddlewareFactory[] = [];
if (process.env.TACH_PASSWORD_PROTECTED === 'true') {
  middlewares.push(passwordProtectedMiddlewareFactory);
}
export default stackMiddlewares(middlewares);

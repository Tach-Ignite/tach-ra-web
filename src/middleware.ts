import { passwordProtectedMiddlewareFactory } from './middlewares/passwordProtectedMiddleware';
import { stackMiddlewares } from './lib/middlewares';

const middlewares = [passwordProtectedMiddlewareFactory];
export default stackMiddlewares(middlewares);

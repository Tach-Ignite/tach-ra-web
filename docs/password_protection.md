# Password Protection

This RA has the ability to protect private websites with a password so only authorized users can access it. This is implemented through a custom middleware

## Setting the username and password

To set the username and password, you need to set the following variables within the `.env.secrets.local` file:

```bash
TACH_PASSWORD_PROTECTED_USERNAME=someusername
TACH_PASSWORD_PROTECTED_PASSWORD=somepassword
```

To set the password for the target environment, use `.env.secrets.local`.

## Removing password protection

To remove password protection, simply remove the password protected middleware from the `middleware.ts` file:

```typescript
// middleware.ts

passwordProtectedMiddleware';
import { stackMiddlewares } from './lib/middlewares';

const middlewares = []; // <-- Remove passwordProtectedMiddlewareFactory from this array
export default stackMiddlewares(middlewares);
```

import { RegisterCredentials } from './registerCredentials';
import { OAuthButtonGrid } from './oAuthButtonGrid';
import { AuthFooter } from './authFooter';

export type RegisterProps = {
  returnUrl?: string;
};

export function Register({ returnUrl }: RegisterProps) {
  return (
    <div>
      <div className="flex flex-col justify-between">
        <div className="flex justify-center">
          <RegisterCredentials returnUrl={returnUrl} />
        </div>
        <div className="flex flex-row relative py-4">
          <div className="relative flex-grow border-t top-4" />
          <div className="relative flex-none text-2xl px-8">or</div>
          <div className="relative flex-grow border-t top-4" />
        </div>
        <div>
          <div className="text-xl mb-4">
            Sign up or sign in using an authentication provider
          </div>
          <OAuthButtonGrid returnUrl={returnUrl} />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <AuthFooter />
      </div>
    </div>
  );
}

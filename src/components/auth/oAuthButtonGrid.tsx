import { IAuthConfiguration, IOptions } from '@/lib/abstractions';
import { arrayHasDuplicates } from '@/lib/utils';
import { ModuleResolver } from '@/lib/ioc/';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { OAuthButton } from './oAuthButton';
import { ReturnUrlProps } from './returnUrlProps';

const m = new ModuleResolver().resolve(ConfigurationModule);
const authConfig = m.resolve<IOptions<IAuthConfiguration>>(
  'authConfigurationOptions',
).value;

export function OAuthButtonGrid({ returnUrl }: ReturnUrlProps) {
  if (arrayHasDuplicates(authConfig.providers)) {
    throw new Error(
      'OAuth providers must be unique. Please remove duplicates from auth.providers in tach.config.js.',
    );
  }
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-3 my-4">
      {authConfig.providers.map((provider) => {
        switch (provider) {
          case 'google':
            return (
              <OAuthButton
                key={provider}
                provider="google"
                iconUrl="https://authjs.dev/img/providers/google.svg"
                alt="Google Logo"
                returnUrl={returnUrl}
                className="border border-tachGrey bg-white text-black"
              >
                Sign in with Google
              </OAuthButton>
            );
          case 'github':
            return (
              <OAuthButton
                key={provider}
                provider="github"
                iconUrl="https://authjs.dev/img/providers/github-dark.svg"
                alt="Github Logo"
                className="bg-black text-white"
                returnUrl={returnUrl}
              >
                Sign in with GitHub
              </OAuthButton>
            );
          case 'azure-ad':
            return (
              <OAuthButton
                key={provider}
                provider="azure-ad"
                iconUrl="https://authjs.dev/img/providers/azure-dark.svg"
                className="bg-[#0072c6] text-white"
                alt="Microsoft Logo"
                returnUrl={returnUrl}
              >
                Sign in with Microsoft
              </OAuthButton>
            );
          case 'linkedin':
            return (
              <OAuthButton
                key={provider}
                provider="linkedin"
                iconUrl="https://authjs.dev/img/providers/linkedin.svg"
                className="bg-[#069] text-white"
                alt="LinkedIn Logo"
                returnUrl={returnUrl}
              >
                Sign in with LinkedIn
              </OAuthButton>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

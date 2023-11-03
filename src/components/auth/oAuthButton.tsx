import { signIn } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';

export type OAuthButtonProps = {
  provider: 'google' | 'github' | 'azure-ad' | 'linkedin';
  iconUrl: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
  returnUrl?: string;
};

export function OAuthButton({
  provider,
  iconUrl,
  alt,
  className,
  children,
  returnUrl,
}: OAuthButtonProps) {
  let style = 'flex w-full p-2 rounded justify-center';
  if (className) {
    style = twMerge(style, className);
  }
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl: returnUrl ?? '/' })}
      className="w-full"
    >
      <div className={style}>
        <div className="flex-none w-8 h-8 self-center">
          <img
            alt={alt}
            loading="lazy"
            height={32}
            width={32}
            id="provider-logo"
            className=""
            src={iconUrl}
          />
        </div>
        <div className="flex-none self-center ml-2">{children}</div>
      </div>
    </button>
  );
}

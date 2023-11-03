import Link from 'next/link';

export function AuthFooter() {
  return (
    <div>
      By signing up, you agree to our{' '}
      <Link
        href="/termsAndConditions"
        className="hover:text-tachPurple underline underline-offset-4 duration-300"
      >
        Terms of Use
      </Link>{' '}
      and{' '}
      <Link
        href="/privacyPolicy"
        className="hover:text-tachPurple underline underline-offset-4 duration-300"
      >
        Privacy Policy
      </Link>
      .
    </div>
  );
}

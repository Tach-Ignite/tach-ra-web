import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

function VerifyEmailPage() {
  const router = useRouter();
  const [content, setContent] = useState<any>(<>Verifying Email...</>);

  const token = router.query.token as string;

  const resendVerificationHandler = useCallback(() => {
    setContent(<div>Resending verification email...</div>);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/resendVerificationEmail`, {
      method: 'PUT',
      body: token,
    })
      .then(() => {
        setContent(
          <div>A new verification link has been sent to your email.</div>,
        );
      })
      .catch(() => {
        setContent(
          <div>
            There was an error resending the verification email. Please try
            again later.
          </div>,
        );
      });
  }, [token, setContent]);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verifyEmail`, {
        method: 'PUT',
        body: token,
        cache: 'no-store',
      })
        .then((result) => {
          if (result.status !== 204) {
            throw new Error();
          }
          setContent(
            <>
              <div>Email Verified!</div>
              <Link href="/">Home</Link>
            </>,
          );
        })
        .catch(() => {
          setContent(
            <>
              <div>
                There was an error verifying your email; The link may have
                expired.
              </div>
              <button type="button" onClick={resendVerificationHandler}>
                Resend Verification Email
              </button>
            </>,
          );
        });
    } else {
      setContent(<div>Token is required.</div>);
    }
  }, [token, setContent, resendVerificationHandler]);

  return content;
}
export default VerifyEmailPage;

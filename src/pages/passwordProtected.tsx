import {
  makeStore,
  useAuthenticateMutation,
  useValidateTokenQuery,
} from '@/rtk';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useEffect, useState, ReactElement } from 'react';
import { Provider } from 'react-redux';

function PasswordProtectedPage() {
  const router = useRouter();
  const returnUrl = (router.query.returnUrl as string) ?? '/';
  const [username, setUsername] = useState<string | null>('');
  const [password, setPassword] = useState<string | null>('');
  const [authenticate, authenticateStatus] = useAuthenticateMutation();
  const { data, isLoading: tokenIsValidating } = useValidateTokenQuery();
  const tokenIsValid = data?.valid;

  useEffect(() => {
    if (!tokenIsValid && !tokenIsValidating && !username) {
      setUsername(prompt('Enter useranme:'));
    }
  }, [tokenIsValid, tokenIsValidating, setUsername, username]);

  useEffect(() => {
    if (!tokenIsValid && !tokenIsValidating && username && !password) {
      setPassword(prompt('Enter your password:'));
    }
  }, [tokenIsValid, tokenIsValidating, setPassword, username, password]);

  useEffect(() => {
    if (!tokenIsValid && !tokenIsValidating && username && password) {
      authenticate({ username, password }).then((result) => {
        const resultAsAny = result as unknown as any;
        if (resultAsAny.error) {
          alert(resultAsAny.error.message);
          setUsername(null);
          setPassword(null);
        }
      });
    }
  }, [
    tokenIsValid,
    tokenIsValidating,
    username,
    password,
    setUsername,
    setPassword,
    authenticate,
  ]);

  if (tokenIsValid) {
    router.push(returnUrl);
  }

  return null;
}

PasswordProtectedPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  const store = makeStore();
  return <Provider store={store}>{page}</Provider>;
};

export default PasswordProtectedPage;

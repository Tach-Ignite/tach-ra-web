import {
  makeStore,
  useAuthenticateMutation,
  useValidateTokenQuery,
} from '@/rtk';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useEffect, useState, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { Button, CenterContainer, Input } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { JSONSchemaType } from 'ajv';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { CognitoUserPoolsAuthorizer } from 'aws-cdk-lib/aws-apigateway';

type PwpForm = {
  username: string;
  password: string;
};

const pwpFormSchema: JSONSchemaType<PwpForm> = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 1 },
  },
  required: ['username', 'password'],
  additionalProperties: false,
};

function PasswordProtectedPage() {
  const router = useRouter();
  const returnUrl = (router.query.returnUrl as string) ?? '/';
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [authenticate, authenticateStatus] = useAuthenticateMutation();
  const { data, isLoading: tokenIsValidating } = useValidateTokenQuery();
  const tokenIsValid = data?.valid;

  // useEffect(() => {
  //   if (!tokenIsValid && !tokenIsValidating && !username) {
  //     setUsername(prompt('Enter username:'));
  //   }
  // }, [tokenIsValid, tokenIsValidating, setUsername, username]);

  // useEffect(() => {
  //   if (!tokenIsValid && !tokenIsValidating && username && !password) {
  //     setPassword(prompt('Enter your password:'));
  //   }
  // }, [tokenIsValid, tokenIsValidating, setPassword, username, password]);

  // useEffect(() => {
  //   if (!tokenIsValid && !tokenIsValidating && username && password) {
  //     authenticate({ username, password }).then((result) => {
  //       const resultAsAny = result as unknown as any;
  //       if (resultAsAny.error) {
  //         alert(resultAsAny.error.message);
  //         setUsername(null);
  //         setPassword(null);
  //       }
  //     });
  //   }
  // }, [
  //   tokenIsValid,
  //   tokenIsValidating,
  //   username,
  //   password,
  //   setUsername,
  //   setPassword,
  //   authenticate,
  // ]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm<PwpForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(pwpFormSchema, { $data: true }),
  });

  function onSubmit(form: PwpForm) {
    if (!tokenIsValid && !tokenIsValidating) {
      authenticate(form).then((result) => {
        const resultAsAny = result as unknown as any;
        if (resultAsAny.error) {
          setSubmitError(resultAsAny.error.data.message);
        }
      });
    }
  }

  function onErrors(errors: any) {
    console.log(errors);
  }

  if (tokenIsValid) {
    router.push(returnUrl);
  }

  return (
    <CenterContainer>
      <form>
        <Input type="text" name="username" register={register} />
        <Input type="password" name="password" register={register} />
        <Button onClick={handleSubmit(onSubmit, onErrors)}>Submit</Button>
        <div className="text-red">{submitError}</div>
      </form>
    </CenterContainer>
  );
}

PasswordProtectedPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  const store = makeStore();
  return <Provider store={store}>{page}</Provider>;
};

export default PasswordProtectedPage;

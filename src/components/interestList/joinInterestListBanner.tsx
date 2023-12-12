import {
  AddUserToInterestListViewModel,
  addUserToInterestListViewModelSchema,
} from '@/models/viewModels/interestLists';
import { useAddUserToInterestListMutation } from '@/rtk';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../ui';
import { useReCaptcha } from 'next-recaptcha-v3';

export function JoinInterestListBanner() {
  const [useAddUserToInterestList, useAddUserToInterestListResult] =
    useAddUserToInterestListMutation();
  const { executeRecaptcha } = useReCaptcha();
  const [submitError, setSubmitError] = useState<string>('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [userAdded, setUserAdded] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AddUserToInterestListViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(addUserToInterestListViewModelSchema, {
      $data: true,
    }),
    defaultValues: {
      optedInToGenericNotifications: true,
      agreedToPrivacyPolicyAndTerms: false,
      recaptchaToken: '',
    },
  });

  async function onSubmitHandler(
    form: AddUserToInterestListViewModel,
    event: any,
  ) {
    setSendingRequest(true);
    event.preventDefault();

    let recaptchaToken = await executeRecaptcha('join_interest_list');
    if (!recaptchaToken) {
      throw new Error('No recaptcha token.');
    }
    form.recaptchaToken = recaptchaToken;

    useAddUserToInterestList(form)
      .then((result) => {
        setUserAdded(true);
      })
      .catch((error) => {
        setSubmitError(error.message);
        setSendingRequest(false);
      });

    if (form.optedInToGenericNotifications) {
      recaptchaToken = await executeRecaptcha('join_interest_list');
      if (!recaptchaToken) {
        throw new Error('No recaptcha token.');
      }
      form.recaptchaToken = recaptchaToken;

      useAddUserToInterestList({ ...form, interestListFriendlyId: 'global' })
        .then((result) => {
          setUserAdded(true);
        })
        .catch((error) => {
          setSubmitError(error.message);
          setSendingRequest(false);
        });
    }
  }

  console.log(errors);

  return (
    <>
      {userAdded && <div>Thank you for joining our interest list!</div>}
      {!userAdded && (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <input
            type="hidden"
            {...register('interestListFriendlyId')}
            value="tachignite"
          />
          <Input
            name="email"
            label="Email"
            type="text"
            required
            register={register}
            errorMessage={errors.email && errors.email.message}
          />
          <Input
            name="phone"
            label="Phone (optional)"
            type="text"
            required
            register={register}
            errorMessage={errors.phone && errors.phone.message}
          />
          <Input
            name="optedInToGenericNotifications"
            label="I would like to recieve updates about Tach Color Store's products and services."
            type="checkbox"
            required
            register={register}
            errorMessage={
              errors.optedInToGenericNotifications &&
              errors.optedInToGenericNotifications.message
            }
          />
          <Input
            name="agreedToPrivacyPolicyAndTerms"
            label="I agree to the Privacy Policy and Terms of Service."
            type="checkbox"
            required
            register={register}
            errorMessage={
              errors.agreedToPrivacyPolicyAndTerms &&
              errors.agreedToPrivacyPolicyAndTerms.message
            }
          />
          <Button
            type="submit"
            onClick={handleSubmit(onSubmitHandler)}
            isLoading={sendingRequest}
            className="bg-tachGrey hover:bg-tachPurple text-white"
          >
            Add
          </Button>
        </form>
      )}
    </>
  );
}

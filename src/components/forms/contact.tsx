import { ajvResolver } from '@hookform/resolvers/ajv';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import Link from 'next/link';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useContactUsMutation } from '@/rtk/apis/contactApi';
import {
  ContactRequestViewModel,
  contactRequestViewModelSchema,
} from '@/models';
import { Button, Input } from '../ui';

export function ContactUsForm() {
  const { executeRecaptcha } = useReCaptcha();
  const [contactUs, contactUsStatus] = useContactUsMutation();
  const [messageSent, setMessageSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactRequestViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(contactRequestViewModelSchema, { $data: true }),
    defaultValues: {
      optedInToEmailAlerts: true,
      agreedToPrivacyPolicy: false,
      recaptchaToken: '',
    },
  });

  async function submitHandler(values: ContactRequestViewModel, event: any) {
    const recaptchaToken = await executeRecaptcha('contact_us');
    if (!recaptchaToken) {
      throw new Error('No recaptcha token.');
    }
    values.recaptchaToken = recaptchaToken;

    await contactUs(values)
      .unwrap()
      .then((res) => setMessageSent(true))
      .catch((err) => {
        throw new Error(err.toString());
      });
  }

  if (messageSent) {
    return (
      <>
        <div className="text-xl font-semibold">Message Sent</div>
        <div className="text-sm text-gray-600 mb-2">
          Thanks for reaching out! We will get back to you shortly.
        </div>
        <Link
          href="/"
          className="underline underline-offset-4 decoration-[1px] hover:text-tachPurple duration-300"
        >
          <p>Continue shopping</p>
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="text-2xl font-semibold mb-4">Contact Us</div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Input
          label="Name"
          name="name"
          type="text"
          required
          placeholder="Jane Smith"
          register={register}
          errorMessage={errors.name && errors.name.message}
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          register={register}
          errorMessage={errors.email && errors.email.message}
        />
        <Input
          label="Message"
          name="message"
          type="textarea"
          maxLength={500}
          required
          register={register}
          errorMessage={errors.message && errors.message.message}
        />
        <Input
          name="optedInToEmailAlerts"
          label="Subscribe to Our Newsletter"
          type="checkbox"
          register={register}
          errorMessage={
            errors.optedInToEmailAlerts && errors.optedInToEmailAlerts.message
          }
        />
        <div className="text-sm mb-2">
          By continuing you agree to our{' '}
          <Link
            href="/privacyPolicy"
            className="underline underline-offset-4 hover:text-tachPurple transition duration-300"
          >
            Privacy Policy
          </Link>
          .
        </div>
        <Input
          name="agreedToPrivacyPolicy"
          label="I agree - I understand that the information I provide will be used as described above."
          type="checkbox"
          register={register}
          errorMessage={
            errors.agreedToPrivacyPolicy && errors.agreedToPrivacyPolicy.message
          }
        />
        <Button className="mt-2" type="submit">
          Contact Us
        </Button>
      </form>
    </>
  );
}

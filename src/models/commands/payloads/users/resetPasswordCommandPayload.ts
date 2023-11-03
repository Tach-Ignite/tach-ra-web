export type ResetPasswordCommandPayload = {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
};

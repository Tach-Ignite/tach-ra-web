export type SetUserProfileCommandPayload = {
  userId: string;
  name: string | undefined;
  phoneNumber: string | undefined;
  agreedToReceiveSmsNotifications: boolean;
};

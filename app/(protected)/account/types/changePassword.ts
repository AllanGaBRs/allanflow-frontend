export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordFormData = ChangePasswordPayload & {
  passwordConfirmation: string;
};

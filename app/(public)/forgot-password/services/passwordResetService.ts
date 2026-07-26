import { api } from "@/app/api/api";
import type {
  ForgotPasswordRequest,
  PasswordResetResponse,
  ResetPasswordRequest,
} from "../types/passwordReset";

export async function requestPasswordResetService(
  payload: ForgotPasswordRequest
): Promise<PasswordResetResponse> {
  const { data } = await api.post<PasswordResetResponse>(
    "/forgot-password",
    payload
  );

  return data;
}

export async function resetPasswordService(
  payload: ResetPasswordRequest
): Promise<PasswordResetResponse> {
  const { data } = await api.post<PasswordResetResponse>(
    "/reset-password",
    payload
  );

  return data;
}

import { api } from "@/app/api/api";
import type { ChangePasswordPayload } from "../types/changePassword";

export async function changePasswordService(
  payload: ChangePasswordPayload
): Promise<void> {
  await api.patch("/users/me/password", payload);
}

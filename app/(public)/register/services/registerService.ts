import { api } from "@/app/api/api";
import type { RegisterRequest, RegisterResponse } from "../types/register";

export async function registerService(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/register", payload);
  return data;
}

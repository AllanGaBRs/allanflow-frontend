import { api } from "@/app/api/api";
import { LoginRequest, LoginResponse } from "../types/auth";

export async function loginService(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/login", payload);
  return data;
}

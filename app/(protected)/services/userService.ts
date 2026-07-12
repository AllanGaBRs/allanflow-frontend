import { api } from "@/app/api/api";
import { AuthUser } from "../types/user";

export async function getCurrentUserService(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}

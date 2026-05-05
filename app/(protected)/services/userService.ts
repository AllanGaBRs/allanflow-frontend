import type { AuthUser } from "../types/user";

export async function getCurrentUserService(): Promise<AuthUser> {
  const response = await fetch("/api/auth/me");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar usuário");
  }

  return data;
}
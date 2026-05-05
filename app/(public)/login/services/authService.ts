import { LoginRequest, LoginResponse } from "../types/auth";

export async function loginService(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro ao logar");
  }

  return data;
}
import type { RegisterRequest, RegisterResponse } from "../types/register";

export async function registerService(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao criar conta");
  }

  return data;
}
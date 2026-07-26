import type { AuthUser } from "@/app/(protected)/types/user";

type ApiErrorBody = {
  error?: string;
  message?: string;
};

export async function getCurrentSessionService(): Promise<AuthUser | null> {
  const response = await fetch("/api/auth/me", {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;

    throw new Error(
      body?.error || body?.message || "Não foi possível verificar sua sessão."
    );
  }

  return (await response.json()) as AuthUser;
}

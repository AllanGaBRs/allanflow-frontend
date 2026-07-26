"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "../services/authService";

function normalizeRedirectTo(redirectTo?: string) {
  if (!redirectTo || !redirectTo.startsWith("/")) {
    return "/workspaces";
  }

  return redirectTo;
}

export function useLogin(redirectTo?: string) {
  const router = useRouter();
  const destination = normalizeRedirectTo(redirectTo);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(email: string, password: string) {
    setLoading(true);
    setError("");

    try {
      await loginService({ email, password });
      router.push(destination);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao logar");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    login,
    loading,
    error,
  };
}

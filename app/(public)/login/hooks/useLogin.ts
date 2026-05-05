"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "../services/authService";

export function useLogin() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(email: string, password: string) {
    setLoading(true);
    setError("");

    try {
      await loginService({ email, password });
      router.push("/workspaces");
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
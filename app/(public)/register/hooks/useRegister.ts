"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerService } from "../services/registerService";

export function useRegister() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function register(name: string, email: string, password: string) {
    setLoading(true);
    setError("");

    try {
      await registerService({
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    register,
    loading,
    error,
  };
}
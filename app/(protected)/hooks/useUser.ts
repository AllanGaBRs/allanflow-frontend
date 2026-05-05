"use client";

import { useEffect, useState } from "react";
import { getCurrentUserService } from "../services/userService";
import type { AuthUser } from "../types/user";

export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUser() {
    setLoading(true);
    setError("");

    try {
      const data = await getCurrentUserService();
      setUser(data);
    } catch (err: unknown) {
      setUser(null);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao buscar usuário");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    error,
    loadUser,
  };
}
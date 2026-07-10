"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentUserService } from "../services/userService";
import type { AuthUser } from "../types/user";

export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialUser() {
      await Promise.resolve();

      try {
        const data = await getCurrentUserService();

        if (active) {
          setUser(data);
          setError("");
        }
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        setUser(null);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro inesperado ao buscar usuário");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialUser();

    return () => {
      active = false;
    };
  }, []);

  return {
    user,
    loading,
    error,
    loadUser,
  };
}

"use client";

import { useEffect, useState } from "react";
import {
  createWorkspaceService,
  getWorkspacesService,
} from "../services/workspaceService";
import type { Workspace } from "../types/workspace";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function loadWorkspaces() {
    setLoading(true);
    setError("");

    try {
      const data = await getWorkspacesService();
      setWorkspaces(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao buscar workspaces");
      }
    } finally {
      setLoading(false);
    }
  }

  async function createWorkspace(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return false;
    }

    setCreating(true);
    setError("");

    try {
      const workspace = await createWorkspaceService({ name: trimmedName });
      setWorkspaces((prev) => [...prev, workspace]);
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao criar workspace");
      }

      return false;
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialWorkspaces() {
      try {
        const data = await getWorkspacesService();

        if (active) {
          setWorkspaces(data);
        }
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro inesperado ao buscar workspaces");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInitialWorkspaces();

    return () => {
      active = false;
    };
  }, []);

  return {
    workspaces,
    loading,
    creating,
    error,
    createWorkspace,
    loadWorkspaces,
  };
}

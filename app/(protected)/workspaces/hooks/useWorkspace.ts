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
  setCreating(true);
  setError("");

  try {
    const workspace = await createWorkspaceService({ name });
    setWorkspaces((prev) => [...prev, workspace]);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Erro inesperado ao criar workspace");
    }
  } finally {
    setCreating(false);
  }
}

  useEffect(() => {
    loadWorkspaces();
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
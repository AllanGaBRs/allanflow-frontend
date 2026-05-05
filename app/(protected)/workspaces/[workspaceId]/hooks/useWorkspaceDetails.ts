"use client";

import { useEffect, useState } from "react";
import { getWorkspaceDetailsService } from "../services/workspaceDetailsService";
import type { WorkspaceDetails } from "../types/workspaceDetails";

export function useWorkspaceDetails(workspaceId: string) {
  const [workspace, setWorkspace] = useState<WorkspaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWorkspace() {
    setLoading(true);
    setError("");

    try {
      const data = await getWorkspaceDetailsService(workspaceId);
      setWorkspace(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao buscar workspace");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, [workspaceId]);

  return {
    workspace,
    loading,
    error,
    loadWorkspace,
  };
}
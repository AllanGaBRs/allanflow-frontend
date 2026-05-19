"use client";

import { useEffect, useState } from "react";
import { getWorkspaceDetailsService } from "../services/workspaceDetailsService";
import type { WorkspaceDetails } from "../types/workspaceDetails";

export function useWorkspaceDetails(
  workspaceId: string,
  initialWorkspace: WorkspaceDetails | null = null,
  initialError = ""
) {
  const [workspace, setWorkspace] = useState<WorkspaceDetails | null>(
    initialWorkspace
  );
  const [loading, setLoading] = useState(!initialWorkspace && !initialError);
  const [error, setError] = useState(initialError);

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
    if (initialWorkspace?.id === workspaceId || initialError) {
      return;
    }

    loadWorkspace();
  }, [workspaceId]);

  return {
    workspace,
    loading,
    error,
    loadWorkspace,
  };
}

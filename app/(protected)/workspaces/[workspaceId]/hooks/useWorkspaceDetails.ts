"use client";

import { useCallback, useEffect, useState } from "react";
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

  const loadWorkspace = useCallback(async () => {
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
  }, [workspaceId]);

  useEffect(() => {
    if (initialWorkspace?.id === workspaceId || initialError) {
      return;
    }

    let active = true;

    async function loadInitialWorkspace() {
      await Promise.resolve();

      if (active) {
        setLoading(true);
        setError("");
      }

      try {
        const data = await getWorkspaceDetailsService(workspaceId);

        if (active) {
          setWorkspace(data);
        }
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro inesperado ao buscar workspace");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialWorkspace();

    return () => {
      active = false;
    };
  }, [initialError, initialWorkspace?.id, workspaceId]);

  return {
    workspace,
    loading,
    error,
    loadWorkspace,
  };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { getDashboardService } from "../services/dashboardService";
import type { Dashboard } from "../types/dashboard";

export function useDashboard(workspaceId: string) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDashboardService(workspaceId);
      setDashboard(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar indicadores"
      );
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    let active = true;

    async function loadInitialDashboard() {
      await Promise.resolve();

      try {
        const data = await getDashboardService(workspaceId);

        if (active) {
          setDashboard(data);
        }
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Erro ao buscar indicadores"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialDashboard();

    return () => {
      active = false;
    };
  }, [workspaceId]);

  return {
    dashboard,
    loading,
    error,
    loadDashboard,
  };
}

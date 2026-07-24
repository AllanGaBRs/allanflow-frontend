import { api } from "@/app/api/api";
import type { Dashboard } from "../types/dashboard";

export async function getDashboardService(
  workspaceId: string
): Promise<Dashboard> {
  const { data } = await api.get<Dashboard>(
    `/workspaces/${workspaceId}/dashboard`
  );

  return data;
}

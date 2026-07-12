import { api } from "@/app/api/api";
import type { WorkspaceDetails } from "../types/workspaceDetails";

export async function getWorkspaceDetailsService(
  workspaceId: string
): Promise<WorkspaceDetails> {
  const { data } = await api.get<WorkspaceDetails>(`/workspaces/${workspaceId}`);
  return data;
}

import type { WorkspaceDetails } from "../types/workspaceDetails";

export async function getWorkspaceDetailsService(
  workspaceId: string
): Promise<WorkspaceDetails> {
  const response = await fetch(`/api/workspaces/${workspaceId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar workspace");
  }

  return data;
}
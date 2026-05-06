import type { CreateWorkspaceRequest, Workspace } from "../types/workspace";

export async function getWorkspacesService(): Promise<Workspace[]> {
  const response = await fetch("/api/workspaces");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar workspaces");
  }

  return Array.isArray(data) ? data : data.workspaces ?? [];
}

export async function createWorkspaceService(
  payload: CreateWorkspaceRequest
): Promise<Workspace> {
  const response = await fetch("/api/workspaces", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao criar workspace");
  }

  return data;
}

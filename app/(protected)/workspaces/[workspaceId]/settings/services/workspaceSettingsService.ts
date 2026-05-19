import type {
  WorkspaceDetails,
  WorkspaceUpdateRequest,
} from "../../types/workspaceDetails";

export async function updateWorkspaceService(
  workspaceId: string,
  payload: WorkspaceUpdateRequest
): Promise<WorkspaceDetails> {
  const response = await fetch(`/api/workspaces/${workspaceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao atualizar workspace");
  }

  return data;
}

export async function deleteWorkspaceService(
  workspaceId: string
): Promise<void> {
  const response = await fetch(`/api/workspaces/${workspaceId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Erro ao excluir workspace");
  }
}

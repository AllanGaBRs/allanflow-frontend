import { api } from "@/app/api/api";
import type {
  WorkspaceDetails,
  WorkspaceUpdateRequest,
} from "../../types/workspaceDetails";

export async function updateWorkspaceService(
  workspaceId: string,
  payload: WorkspaceUpdateRequest
): Promise<WorkspaceDetails> {
  const { data } = await api.put<WorkspaceDetails>(
    `/workspaces/${workspaceId}`,
    payload
  );
  return data;
}

export async function deleteWorkspaceService(
  workspaceId: string
): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}`);
}

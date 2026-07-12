import { api } from "@/app/api/api";
import type { Label, LabelCreatePayload } from "../types/label";

function labelUrl(workspaceId: string, boardId: string) {
  return `/workspaces/${workspaceId}/boards/${boardId}/labels`;
}

export async function getLabelsService(
  workspaceId: string,
  boardId: string
): Promise<Label[]> {
  const { data } = await api.get<Label[]>(labelUrl(workspaceId, boardId));
  return data;
}

export async function createLabelService(
  workspaceId: string,
  boardId: string,
  payload: LabelCreatePayload
): Promise<Label> {
  const { data } = await api.post<Label>(labelUrl(workspaceId, boardId), payload);
  return data;
}

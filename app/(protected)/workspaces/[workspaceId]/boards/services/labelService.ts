import { api } from "@/app/api/api";
import type {
  Label,
  LabelCreatePayload,
  LabelUpdatePayload,
} from "../types/label";

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

export async function getLabelService(
  workspaceId: string,
  boardId: string,
  labelId: string
): Promise<Label> {
  const { data } = await api.get<Label>(
    `${labelUrl(workspaceId, boardId)}/${labelId}`
  );
  return data;
}

export async function updateLabelService(
  workspaceId: string,
  boardId: string,
  labelId: string,
  payload: LabelUpdatePayload
): Promise<Label> {
  const { data } = await api.put<Label>(
    `${labelUrl(workspaceId, boardId)}/${labelId}`,
    payload
  );
  return data;
}

export async function deleteLabelService(
  workspaceId: string,
  boardId: string,
  labelId: string
): Promise<void> {
  await api.delete(`${labelUrl(workspaceId, boardId)}/${labelId}`);
}

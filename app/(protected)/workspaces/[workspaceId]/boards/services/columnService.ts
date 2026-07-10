import { api } from "@/app/api/api";
import type {
  Column,
  ColumnCreatePayload,
  ColumnUpdatePayload,
} from "../types/board";

function columnUrl(workspaceId: string, boardId: string) {
  return `/workspaces/${workspaceId}/boards/${boardId}/columns`;
}

export async function getColumnsService(
  workspaceId: string,
  boardId: string
): Promise<Column[]> {
  const { data } = await api.get<Column[]>(columnUrl(workspaceId, boardId));
  return data;
}

export async function createColumnService(
  workspaceId: string,
  boardId: string,
  payload: ColumnCreatePayload
): Promise<Column> {
  const { data } = await api.post<Column>(
    columnUrl(workspaceId, boardId),
    payload
  );
  return data;
}

export async function getColumnService(
  workspaceId: string,
  boardId: string,
  columnId: string
): Promise<Column> {
  const { data } = await api.get<Column>(
    `${columnUrl(workspaceId, boardId)}/${columnId}`
  );
  return data;
}

export async function updateColumnService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  payload: ColumnUpdatePayload
): Promise<Column> {
  const { data } = await api.put<Column>(
    `${columnUrl(workspaceId, boardId)}/${columnId}`,
    payload
  );
  return data;
}

export async function deleteColumnService(
  workspaceId: string,
  boardId: string,
  columnId: string
): Promise<void> {
  await api.delete(`${columnUrl(workspaceId, boardId)}/${columnId}`);
}

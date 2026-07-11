import { api } from "@/app/api/api";
import type { Board, BoardCreatePayload, BoardUpdatePayload } from "../types/board";

export async function getBoardsService(workspaceId: string): Promise<Board[]> {
  const { data } = await api.get<Board[]>(
    `/workspaces/${workspaceId}/boards`
  );
  return data;
}

export async function createBoardService(
  workspaceId: string,
  payload: BoardCreatePayload
): Promise<Board> {
  const { data } = await api.post<Board>(
    `/workspaces/${workspaceId}/boards`,
    payload
  );
  return data;
}

export async function getBoardService(
  workspaceId: string,
  boardId: string
): Promise<Board> {
  const { data } = await api.get<Board>(
    `/workspaces/${workspaceId}/boards/${boardId}`
  );
  return data;
}

export async function updateBoardService(
  workspaceId: string,
  boardId: string,
  payload: BoardUpdatePayload
): Promise<Board> {
  const { data } = await api.put<Board>(
    `/workspaces/${workspaceId}/boards/${boardId}`,
    payload
  );
  return data;
}

export async function deleteBoardService(
  workspaceId: string,
  boardId: string
): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/boards/${boardId}`);
}

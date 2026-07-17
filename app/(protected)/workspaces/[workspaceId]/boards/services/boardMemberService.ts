import { api } from "@/app/api/api";
import type {
  BoardMember,
  BoardMemberCreatePayload,
} from "../types/boardMember";

function boardMembersUrl(workspaceId: string, boardId: string) {
  return `/workspaces/${workspaceId}/boards/${boardId}/members`;
}

export async function getBoardMembersService(
  workspaceId: string,
  boardId: string
): Promise<BoardMember[]> {
  const { data } = await api.get<BoardMember[]>(
    boardMembersUrl(workspaceId, boardId)
  );

  return data;
}

export async function addBoardMemberService(
  workspaceId: string,
  boardId: string,
  payload: BoardMemberCreatePayload
): Promise<BoardMember> {
  const { data } = await api.post<BoardMember>(
    boardMembersUrl(workspaceId, boardId),
    payload
  );

  return data;
}

export async function removeBoardMemberService(
  workspaceId: string,
  boardId: string,
  userId: string
): Promise<void> {
  await api.delete(`${boardMembersUrl(workspaceId, boardId)}/${userId}`);
}

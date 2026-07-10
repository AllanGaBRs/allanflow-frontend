import { api } from "@/app/api/api";
import type {
  AddMemberRequest,
  Member,
  UpdateMemberRoleRequest,
} from "../types/member";

export async function getMembersService(workspaceId: string): Promise<Member[]> {
  const { data } = await api.get<Member[]>(
    `/workspaces/${workspaceId}/members`
  );
  return data;
}

export async function addMemberService(
  workspaceId: string,
  payload: AddMemberRequest
): Promise<Member> {
  const { data } = await api.post<Member>(
    `/workspaces/${workspaceId}/members`,
    payload
  );
  return data;
}

export async function updateMemberRoleService(
  workspaceId: string,
  userId: string,
  payload: UpdateMemberRoleRequest
): Promise<Member> {
  const { data } = await api.put<Member>(
    `/workspaces/${workspaceId}/members/${userId}`,
    payload
  );
  return data;
}

export async function removeMemberService(
  workspaceId: string,
  userId: string
): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
}

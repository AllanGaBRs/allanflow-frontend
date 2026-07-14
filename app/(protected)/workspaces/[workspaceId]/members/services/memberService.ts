import { api } from "@/app/api/api";
import type {
  AddMemberRequest,
  Member,
  UpdateMemberRoleRequest,
} from "../types/member";

type MemberResponse = {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  role: Member["role"];
};

function normalizeMember(member: MemberResponse): Member {
  return {
    userId: member.userId,
    userName: member.name,
    userEmail: member.email,
    role: member.role,
  };
}

export async function getMembersService(workspaceId: string): Promise<Member[]> {
  const { data } = await api.get<MemberResponse[]>(
    `/workspaces/${workspaceId}/members`
  );
  return data.map(normalizeMember);
}

export async function addMemberService(
  workspaceId: string,
  payload: AddMemberRequest
): Promise<Member> {
  const { data } = await api.post<MemberResponse>(
    `/workspaces/${workspaceId}/members`,
    payload
  );
  return normalizeMember(data);
}

export async function updateMemberRoleService(
  workspaceId: string,
  userId: string,
  payload: UpdateMemberRoleRequest
): Promise<Member> {
  const { data } = await api.put<MemberResponse>(
    `/workspaces/${workspaceId}/members/${userId}`,
    payload
  );
  return normalizeMember(data);
}

export async function removeMemberService(
  workspaceId: string,
  userId: string
): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
}

import type {
  AddMemberRequest,
  Member,
  UpdateMemberRoleRequest,
} from "../types/member";

export async function getMembersService(workspaceId: string): Promise<Member[]> {
  const response = await fetch(`/api/workspaces/${workspaceId}/members`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar membros");
  }

  return data;
}

export async function addMemberService(
  workspaceId: string,
  payload: AddMemberRequest
): Promise<Member> {
  const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao adicionar membro");
  }

  return data;
}

export async function updateMemberRoleService(
  workspaceId: string,
  userId: string,
  payload: UpdateMemberRoleRequest
): Promise<Member> {
  const response = await fetch(
    `/api/workspaces/${workspaceId}/members/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao atualizar membro");
  }

  return data;
}

export async function removeMemberService(
  workspaceId: string,
  userId: string
): Promise<void> {
  const response = await fetch(
    `/api/workspaces/${workspaceId}/members/${userId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Erro ao remover membro");
  }
}
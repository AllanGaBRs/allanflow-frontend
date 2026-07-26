import { api } from "@/app/api/api";
import type {
  AcceptInvitationRequest,
  WorkspaceInvitation,
} from "../types/invitation";

export async function getWorkspaceInvitationService(
  invitationId: string
): Promise<WorkspaceInvitation> {
  const { data } = await api.get<WorkspaceInvitation>(
    `/invitations/${invitationId}`
  );

  return data;
}

export async function acceptWorkspaceInvitationService(
  invitationId: string,
  payload: AcceptInvitationRequest
): Promise<void> {
  await api.post(`/invitations/${invitationId}/accept`, payload);
}

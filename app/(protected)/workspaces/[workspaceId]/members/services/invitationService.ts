import { api } from "@/app/api/api";
import type { MembershipRole } from "../types/member";

export type WorkspaceInvitationRequest = {
  email: string;
  role: MembershipRole;
};

type WorkspaceInvitationResponse = {
  success: boolean;
};

export async function sendWorkspaceInvitationService(
  workspaceId: string,
  payload: WorkspaceInvitationRequest
): Promise<void> {
  await api.post<WorkspaceInvitationResponse>(
    `/workspaces/${workspaceId}/invitations`,
    payload
  );
}

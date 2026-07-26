import type { MembershipRole } from "@/app/(protected)/workspaces/[workspaceId]/members/types/member";

export type WorkspaceInvitation = {
  id: string;
  workspaceName: string;
  invitedByName: string;
  role: MembershipRole;
  expiresAt: string;
  accepted: boolean;
};

export type AcceptInvitationRequest = {
  code: string;
};

import type { WorkspaceDetails } from "../types/workspaceDetails";

type WorkspaceRole = WorkspaceDetails["userRole"];

export function canManageWorkspace(role: WorkspaceRole) {
  return role === "OWNER" || role === "ADMIN";
}

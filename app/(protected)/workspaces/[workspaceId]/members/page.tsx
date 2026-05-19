import { redirect } from "next/navigation";
import { WorkspaceMembersPage } from "./components/WorkspaceMembersPage";
import { getWorkspaceDetailsServerService } from "../services/workspaceDetailsServerService";
import { canManageWorkspace } from "../utils/workspacePermissions";

type WorkspaceMembersRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function MembersPage({ params }: WorkspaceMembersRouteProps) {
  const { workspaceId } = await params;
  const { workspace, error } =
    await getWorkspaceDetailsServerService(workspaceId);

  if (!workspace) {
    redirect("/workspaces");
  }

  if (workspace && !canManageWorkspace(workspace.userRole)) {
    redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <WorkspaceMembersPage
      workspaceId={workspaceId}
      initialWorkspace={workspace}
      initialError={error}
    />
  );
}

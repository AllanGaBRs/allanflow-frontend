import { redirect } from "next/navigation";
import { WorkspaceDashboardPage } from "./dashboard/components/WorkspaceDashboardPage";
import { getWorkspaceDetailsServerService } from "./services/workspaceDetailsServerService";
import { canManageWorkspace } from "./utils/workspacePermissions";

type WorkspacesDetailsPageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspaceDetailsPage({
  params,
}: WorkspacesDetailsPageProps) {
  const { workspaceId } = await params;
  const { workspace, error } = await getWorkspaceDetailsServerService(
    workspaceId
  );

  if (!workspace) {
    redirect("/workspaces");
  }

  if (!canManageWorkspace(workspace.userRole)) {
    redirect(`/workspaces/${workspaceId}/boards`);
  }

  return (
    <WorkspaceDashboardPage
      workspaceId={workspaceId}
      initialWorkspace={workspace}
      initialError={error}
    />
  );
}

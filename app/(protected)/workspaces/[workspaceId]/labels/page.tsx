import { redirect } from "next/navigation";
import { WorkspaceLabelsPage } from "./components/WorkspaceLabelsPage";
import { getWorkspaceDetailsServerService } from "../services/workspaceDetailsServerService";
import { canManageWorkspace } from "../utils/workspacePermissions";

type WorkspaceLabelsRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function LabelsPage({ params }: WorkspaceLabelsRouteProps) {
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
    <WorkspaceLabelsPage
      workspaceId={workspaceId}
      initialWorkspace={workspace}
      initialError={error}
    />
  );
}

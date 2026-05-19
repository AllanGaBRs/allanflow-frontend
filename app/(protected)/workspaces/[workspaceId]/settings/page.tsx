import { redirect } from "next/navigation";
import { getWorkspaceDetailsServerService } from "../services/workspaceDetailsServerService";
import { canManageWorkspace } from "../utils/workspacePermissions";
import { WorkspaceSettingsPage } from "./components/WorkspaceSettingsPage";

type WorkspaceSettingsRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function SettingsPage({
  params,
}: WorkspaceSettingsRouteProps) {
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
    <WorkspaceSettingsPage
      workspaceId={workspaceId}
      initialWorkspace={workspace}
      initialError={error}
    />
  );
}

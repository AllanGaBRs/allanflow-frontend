import { redirect } from "next/navigation";
import { getWorkspaceDetailsServerService } from "../../services/workspaceDetailsServerService";
import { canManageWorkspace } from "../../utils/workspacePermissions";
import { BoardsManagePage } from "../components/BoardsManagePage";

type BoardsManageRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspaceBoardsManagePage({
  params,
}: BoardsManageRouteProps) {
  const { workspaceId } = await params;
  const { workspace } = await getWorkspaceDetailsServerService(workspaceId);

  if (!workspace) {
    redirect("/workspaces");
  }

  if (!canManageWorkspace(workspace.userRole)) {
    redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <BoardsManagePage workspaceId={workspaceId} initialWorkspace={workspace} />
  );
}

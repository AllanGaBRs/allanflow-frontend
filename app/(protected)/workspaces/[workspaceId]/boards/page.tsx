import { redirect } from "next/navigation";
import { getWorkspaceDetailsServerService } from "../services/workspaceDetailsServerService";
import { BoardsPage } from "./components/BoardsPage";

type BoardsRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspaceBoardsPage({ params }: BoardsRouteProps) {
  const { workspaceId } = await params;
  const { workspace } = await getWorkspaceDetailsServerService(workspaceId);

  if (!workspace) {
    redirect("/workspaces");
  }

  return <BoardsPage workspaceId={workspaceId} initialWorkspace={workspace} />;
}

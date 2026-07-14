import { redirect } from "next/navigation";
import { getWorkspaceDetailsServerService } from "../services/workspaceDetailsServerService";
import { ClientsPage } from "./components/ClientsPage";

type ClientsRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspaceClientsPage({ params }: ClientsRouteProps) {
  const { workspaceId } = await params;
  const { workspace } = await getWorkspaceDetailsServerService(workspaceId);

  if (!workspace) {
    redirect("/workspaces");
  }

  return <ClientsPage workspaceId={workspaceId} initialWorkspace={workspace} />;
}

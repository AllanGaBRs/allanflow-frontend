import { redirect } from "next/navigation";
import { WorkspaceDocumentsPage } from "./components/WorkspaceDocumentsPage";
import { getWorkspaceDetailsServerService } from "../services/workspaceDetailsServerService";

type WorkspaceDocumentsRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function DocumentsPage({
  params,
}: WorkspaceDocumentsRouteProps) {
  const { workspaceId } = await params;
  const { workspace, error } =
    await getWorkspaceDetailsServerService(workspaceId);

  if (!workspace) {
    redirect("/workspaces");
  }

  return (
    <WorkspaceDocumentsPage
      workspaceId={workspaceId}
      initialWorkspace={workspace}
      initialError={error}
    />
  );
}

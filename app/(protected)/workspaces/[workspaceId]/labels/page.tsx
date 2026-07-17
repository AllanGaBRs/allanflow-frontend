import { redirect } from "next/navigation";
import { WorkspaceLabelsPage } from "./components/WorkspaceLabelsPage";
import { getWorkspaceDetailsServerService } from "../services/workspaceDetailsServerService";

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

  return (
    <WorkspaceLabelsPage
      workspaceId={workspaceId}
      initialWorkspace={workspace}
      initialError={error}
    />
  );
}

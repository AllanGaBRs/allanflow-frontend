import { WorkspaceMembersPage } from "./components/WorkspaceMembersPage";
import { getWorkspaceDetailsServerService } from "../services/workspaceDetailsServerService";

type WorkspaceMembersRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function MembersPage({ params }: WorkspaceMembersRouteProps) {
  const { workspaceId } = await params;
  const { workspace, error } =
    await getWorkspaceDetailsServerService(workspaceId);

  return (
    <WorkspaceMembersPage
      workspaceId={workspaceId}
      initialWorkspace={workspace}
      initialError={error}
    />
  );
}

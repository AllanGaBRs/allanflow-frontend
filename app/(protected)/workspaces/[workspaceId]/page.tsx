import { WorkspaceDetails } from "./components/WorkspaceDetails";
import { getWorkspaceDetailsServerService } from "./services/workspaceDetailsServerService";

type WorkspacesDetailsPageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspaceDetailsPage({
  params,
}: WorkspacesDetailsPageProps) {
  const { workspaceId } = await params;
  const { workspace, error } =
    await getWorkspaceDetailsServerService(workspaceId);

  return (
    <WorkspaceDetails
      workspaceId={workspaceId}
      initialWorkspace={workspace}
      initialError={error}
    />
  );
}

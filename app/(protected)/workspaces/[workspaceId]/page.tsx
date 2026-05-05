import { WorkspaceDetails } from "./components/WorkspaceDetails";

type WorkspacesDetailsPageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspaceDetailsPage({
  params,
}: WorkspacesDetailsPageProps) {
  const { workspaceId } = await params;

  return <WorkspaceDetails workspaceId={workspaceId} />;
}
import { WorkspaceMembersPage } from "./components/WorkspaceMembersPage";

type WorkspaceMembersRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function MembersPage({ params }: WorkspaceMembersRouteProps) {
  const { workspaceId } = await params;

  return <WorkspaceMembersPage workspaceId={workspaceId} />;
}

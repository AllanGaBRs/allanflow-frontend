"use client";

import { useWorkspaceDetails } from "../hooks/useWorkspaceDetails";
import { WorkspaceLayout } from "../../components/WorkspaceLayout";
import type { WorkspaceDetails as WorkspaceDetailsType } from "../types/workspaceDetails";

type WorkspaceDetailsProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetailsType | null;
  initialError: string;
};

export function WorkspaceDetails({
  workspaceId,
  initialWorkspace,
  initialError,
}: WorkspaceDetailsProps) {
  const { workspace, loading, error } = useWorkspaceDetails(
    workspaceId,
    initialWorkspace,
    initialError
  );
  const headerTitle = loading ? "Carregando..." : workspace?.name ?? "Workspace";

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={workspace?.userRole}
      headerTitle={headerTitle}
      headerSubtitle=""
    >
      <section className="flex-1 p-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
      </section>
    </WorkspaceLayout>
  );
}

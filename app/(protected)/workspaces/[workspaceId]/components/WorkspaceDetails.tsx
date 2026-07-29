"use client";

import { useWorkspaceDetails } from "../hooks/useWorkspaceDetails";
import { WorkspaceLayout } from "../../components/WorkspaceLayout";
import type { WorkspaceDetails as WorkspaceDetailsType } from "../types/workspaceDetails";
import { useToastMessage } from "@/components/notifications/useToastMessage";

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
  useToastMessage(error, { title: "Erro ao carregar workspace" });
  const headerTitle = loading ? "Carregando..." : workspace?.name ?? "Workspace";

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={workspace?.userRole}
      headerTitle={headerTitle}
      headerSubtitle=""
    >
      <section className="flex-1 p-8">
      </section>
    </WorkspaceLayout>
  );
}

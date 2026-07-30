"use client";

import { Users } from "lucide-react";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useWorkspaceDetails } from "../../hooks/useWorkspaceDetails";
import { MembersSection } from "./MembersSection";
import type { WorkspaceDetails } from "../../types/workspaceDetails";

type WorkspaceMembersPageProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetails | null;
  initialError: string;
};

export function WorkspaceMembersPage({
  workspaceId,
  initialWorkspace,
  initialError,
}: WorkspaceMembersPageProps) {
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
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Users size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Membros
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {loading
                    ? "Carregando workspace..."
                    : `Gerencie os membros de ${workspace?.name ?? "workspace"}.`}
                </p>
              </div>
            </div>
          </div>
        </header>

        <MembersSection workspaceId={workspaceId} />
      </section>
    </WorkspaceLayout>
  );
}

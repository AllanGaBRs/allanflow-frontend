import { useToastMessage } from "@/components/notifications/useToastMessage";
import { WorkspaceCard } from "./WorkspaceCard";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";
import type { Workspace } from "../types/workspace";

type WorkspaceDashboardContentProps = {
  workspaces: Workspace[];
  loading: boolean;
  error: string;
};

export function WorkspaceDashboardContent({
  workspaces,
  loading,
  error,
}: WorkspaceDashboardContentProps) {
  useToastMessage(error, { title: "Erro ao buscar workspaces" });

  return (
    <>
      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Carregando workspaces...
        </div>
      )}

      {!loading && workspaces.length === 0 && <WorkspaceEmptyState />}

      {!loading && workspaces.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </>
  );
}

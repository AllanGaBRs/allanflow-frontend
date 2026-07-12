import { AlertCircle } from "lucide-react";
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
  return (
    <>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

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

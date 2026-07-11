import { Plus } from "lucide-react";

type WorkspaceDashboardHeaderProps = {
  onCreateWorkspace: () => void;
};

export function WorkspaceDashboardHeader({
  onCreateWorkspace,
}: WorkspaceDashboardHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Seus workspaces
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Todos os ambientes dos quais você faz parte.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateWorkspace}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:self-auto"
      >
        <Plus size={18} />
        Novo workspace
      </button>
    </div>
  );
}
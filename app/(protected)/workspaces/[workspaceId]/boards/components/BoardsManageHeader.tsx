import { Kanban, Plus } from "lucide-react";

type BoardsManageHeaderProps = {
  onCreateBoard: () => void;
};

export function BoardsManageHeader({
  onCreateBoard,
}: BoardsManageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
          <Kanban size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Gerenciar boards
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Crie, edite e organize os boards deste workspace.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCreateBoard}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <Plus size={18} />
        Novo board
      </button>
    </div>
  );
}

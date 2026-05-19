import { Kanban, Settings2 } from "lucide-react";
import type { Board } from "../types/board";

type BoardCardProps = {
  board: Board;
  loading: boolean;
  onManage: (board: Board) => void;
};

export function BoardCard({
  board,
  loading,
  onManage,
}: BoardCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Kanban size={22} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-950">
              {board.name}
            </h2>
            <p className="mt-1 text-xs text-slate-500">Board</p>
          </div>
        </div>
      </div>

      {board.description && (
        <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-600">
          {board.description}
        </p>
      )}

      <div>
        <button
          type="button"
          onClick={() => onManage(board)}
          disabled={loading}
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Settings2 size={16} />
          Gerenciar
        </button>
      </div>
    </article>
  );
}

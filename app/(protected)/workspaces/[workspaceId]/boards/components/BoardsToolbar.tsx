import Link from "next/link";
import { Kanban, Settings2 } from "lucide-react";
import type { Board } from "../types/board";

type BoardsToolbarProps = {
  workspaceId: string;
  boards: Board[];
  selectedBoardId: string;
  loading: boolean;
  canManageBoards: boolean;
  onSelectBoard: (boardId: string) => void;
};

export function BoardsToolbar({
  workspaceId,
  boards,
  selectedBoardId,
  loading,
  canManageBoards,
  onSelectBoard,
}: BoardsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
          <Kanban size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-950">Boards</h1>
          <p className="mt-1 text-sm text-slate-500">
            Visualize e alterne entre os boards disponíveis.
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="board-filter">
          Selecionar board
        </label>
        <select
          id="board-filter"
          value={selectedBoardId}
          onChange={(event) => onSelectBoard(event.target.value)}
          disabled={loading || boards.length === 0}
          className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:w-64"
        >
          {boards.length === 0 ? (
            <option value="">Nenhum board disponível</option>
          ) : (
            boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))
          )}
        </select>

        {canManageBoards && (
          <Link
            href={`/workspaces/${workspaceId}/boards/manage`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <Settings2 size={18} />
            Gerenciar boards
          </Link>
        )}
      </div>
    </div>
  );
}

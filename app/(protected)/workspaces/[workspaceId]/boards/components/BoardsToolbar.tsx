import Link from "next/link";
import { Settings2 } from "lucide-react";
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
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
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
  );
}

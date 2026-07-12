import { AlertCircle } from "lucide-react";
import { BoardCard } from "./BoardCard";
import { BoardsEmptyState } from "./BoardsEmptyState";
import type { Board } from "../types/board";

type BoardsManageContentProps = {
  boards: Board[];
  loading: boolean;
  saving: boolean;
  error: string;
  onManageBoard: (board: Board) => void;
};

export function BoardsManageContent({
  boards,
  loading,
  saving,
  error,
  onManageBoard,
}: BoardsManageContentProps) {
  return (
    <>
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Carregando boards...
        </div>
      )}

      {!loading && boards.length === 0 && (
        <BoardsEmptyState
          title="Nenhum board ainda"
          description="Crie o primeiro board para começar a organizar tarefas deste workspace."
        />
      )}

      {!loading && boards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              loading={saving}
              onManage={onManageBoard}
            />
          ))}
        </div>
      )}
    </>
  );
}

import type { Board, Column } from "../types/board";
import { BoardsEmptyState } from "./BoardsEmptyState";

type BoardColumnsViewProps = {
  board: Board;
  columns: Column[];
  loading: boolean;
};

export function BoardColumnsView({
  board,
  columns,
  loading,
}: BoardColumnsViewProps) {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div className="mb-4 border-b border-slate-200 pb-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-950">
            {board.name}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            {board.description || "Board selecionado"}
          </p>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Carregando colunas...
        </div>
      )}

      {!loading && columns.length === 0 && (
        <BoardsEmptyState
          centered
          title="Nenhuma coluna ainda"
          description="Crie a primeira coluna para começar a estruturar este board."
        />
      )}

      {!loading && columns.length > 0 && (
        <div className="min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden pb-3">
          <div className="flex min-h-full w-max gap-4 pr-4">
            {columns.map((column) => (
              <article
                key={column.id}
                className="flex min-h-[calc(100vh-15rem)] w-[320px] shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {column.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Posição {column.position}
                  </p>
                </div>

                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
                  Nenhuma tarefa nesta coluna
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

import type { Board, Column } from "../types/board";
import type { TasksByColumn } from "../hooks/useTasksByColumn";
import { BoardsEmptyState } from "./BoardsEmptyState";
import { TaskCard } from "./TaskCard";

type BoardColumnsViewProps = {
  board: Board;
  columns: Column[];
  loading: boolean;
  tasksByColumn: TasksByColumn;
  tasksLoading: boolean;
};

export function BoardColumnsView({
  board,
  columns,
  loading,
  tasksByColumn,
  tasksLoading,
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
            {columns.map((column) => {
              const tasks = tasksByColumn[column.id] ?? [];

              return (
                <article
                  key={column.id}
                  className="flex min-h-[calc(100vh-15rem)] w-[320px] shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {column.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Posição {column.position}
                      </p>
                    </div>

                    <span className="inline-flex min-h-7 shrink-0 items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600">
                      {tasks.length}
                    </span>
                  </div>

                  {tasksLoading && (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
                      Carregando tarefas...
                    </div>
                  )}

                  {!tasksLoading && tasks.length === 0 && (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
                      Nenhuma tarefa nesta coluna
                    </div>
                  )}

                  {!tasksLoading && tasks.length > 0 && (
                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                      {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

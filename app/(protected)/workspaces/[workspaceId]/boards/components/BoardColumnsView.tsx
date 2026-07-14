"use client";

import { useRef, useState } from "react";
import type { DragEvent } from "react";
import type { Board, Column } from "../types/board";
import type { TasksByColumn } from "../hooks/useTasksByColumn";
import type { Task } from "../types/task";
import { BoardsEmptyState } from "./BoardsEmptyState";
import { TaskCard } from "./TaskCard";

type BoardColumnsViewProps = {
  board: Board;
  columns: Column[];
  loading: boolean;
  tasksByColumn: TasksByColumn;
  tasksLoading: boolean;
  movingTask: boolean;
  onMoveTask: (
    taskId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetPosition?: number
  ) => Promise<boolean>;
  onOpenTask: (task: Task) => void;
};

type DraggedTask = {
  taskId: string;
  sourceColumnId: string;
};

export function BoardColumnsView({
  board,
  columns,
  loading,
  tasksByColumn,
  tasksLoading,
  movingTask,
  onMoveTask,
  onOpenTask,
}: BoardColumnsViewProps) {
  const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState("");
  const dropLocked = useRef(false);
  const openLocked = useRef(false);

  function unlockOpenAfterDrag() {
    window.setTimeout(() => {
      openLocked.current = false;
    }, 0);
  }

  function handleDragStart(
    event: DragEvent<HTMLElement>,
    taskId: string,
    sourceColumnId: string
  ) {
    if (dropLocked.current || movingTask) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ taskId, sourceColumnId })
    );
    setDraggedTask({ taskId, sourceColumnId });
    openLocked.current = true;
  }

  function handleDragOver(
    event: DragEvent<HTMLElement>,
    targetColumnId: string
  ) {
    event.stopPropagation();

    if (!draggedTask || draggedTask.sourceColumnId === targetColumnId) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverColumnId(targetColumnId);
  }

  async function handleDrop(
    event: DragEvent<HTMLElement>,
    targetColumnId: string,
    targetPosition: number
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (
      dropLocked.current ||
      movingTask ||
      !draggedTask ||
      draggedTask.sourceColumnId === targetColumnId
    ) {
      setDraggedTask(null);
      setDragOverColumnId("");
      unlockOpenAfterDrag();
      return;
    }

    dropLocked.current = true;

    try {
      await onMoveTask(
        draggedTask.taskId,
        draggedTask.sourceColumnId,
        targetColumnId,
        targetPosition
      );
    } finally {
      dropLocked.current = false;
      setDraggedTask(null);
      setDragOverColumnId("");
      unlockOpenAfterDrag();
    }
  }

  function handleDragEnd() {
    setDraggedTask(null);
    setDragOverColumnId("");
    unlockOpenAfterDrag();
  }

  const dragDisabled = tasksLoading || movingTask;

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
              const isDragOver = dragOverColumnId === column.id;

              return (
                <article
                  key={column.id}
                  onDragOver={(event) => handleDragOver(event, column.id)}
                  onDragLeave={() => setDragOverColumnId("")}
                  onDrop={(event) =>
                    void handleDrop(event, column.id, tasks.length)
                  }
                  className={`flex min-h-[calc(100vh-15rem)] w-[320px] shrink-0 flex-col rounded-lg border p-4 transition ${
                    isDragOver
                      ? "border-slate-400 bg-slate-100"
                      : "border-slate-200 bg-slate-50"
                  }`}
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
                    <div
                      onDragOver={(event) => handleDragOver(event, column.id)}
                      onDrop={(event) => void handleDrop(event, column.id, 0)}
                      className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500"
                    >
                      Nenhuma tarefa nesta coluna
                    </div>
                  )}

                  {!tasksLoading && tasks.length > 0 && (
                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                      {tasks.map((task, index) => (
                        <div
                          key={task.id}
                          onDragOver={(event) =>
                            handleDragOver(event, column.id)
                          }
                          onDrop={(event) =>
                            void handleDrop(event, column.id, index)
                          }
                        >
                          <TaskCard
                            task={task}
                            dragging={draggedTask?.taskId === task.id}
                            onOpen={() => {
                              if (!openLocked.current) {
                                onOpenTask(task);
                              }
                            }}
                            onDragStart={(event) => {
                              if (dragDisabled) {
                                event.preventDefault();
                                return;
                              }

                              handleDragStart(event, task.id, column.id);
                            }}
                            onDragEnd={handleDragEnd}
                          />
                        </div>
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

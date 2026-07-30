"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { DragEvent } from "react";
import type { Column } from "../types/board";
import type { TasksByColumn } from "../hooks/useTasksByColumn";
import type { Task } from "../types/task";
import { BoardsEmptyState } from "./BoardsEmptyState";
import { TaskCard } from "./TaskCard";

type BoardColumnsViewProps = {
  columns: Column[];
  loading: boolean;
  tasksByColumn: TasksByColumn;
  moveTasksByColumn?: TasksByColumn;
  tasksLoading: boolean;
  movingTask: boolean;
  onMoveTask: (
    taskId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetPosition?: number
  ) => Promise<boolean>;
  onOpenTask: (task: Task) => void;
  onCreateTask: (columnId: string) => void;
};

type DraggedTask = {
  taskId: string;
  sourceColumnId: string;
};

type DragOverTarget = {
  columnId: string;
  position: number;
};

export function BoardColumnsView({
  columns,
  loading,
  tasksByColumn,
  moveTasksByColumn,
  tasksLoading,
  movingTask,
  onMoveTask,
  onOpenTask,
  onCreateTask,
}: BoardColumnsViewProps) {
  const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null);
  const [dragOverTarget, setDragOverTarget] =
    useState<DragOverTarget | null>(null);
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
    targetColumnId: string,
    targetPosition: number
  ) {
    event.stopPropagation();

    if (!draggedTask) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverTarget({ columnId: targetColumnId, position: targetPosition });
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
      !draggedTask
    ) {
      setDraggedTask(null);
      setDragOverTarget(null);
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
      setDragOverTarget(null);
      unlockOpenAfterDrag();
    }
  }

  function handleDragEnd() {
    setDraggedTask(null);
    setDragOverTarget(null);
    unlockOpenAfterDrag();
  }

  function getDropPosition(tasks: Task[], taskIndex: number, placeAfter: boolean) {
    const tasksBeforeDrop = tasks.slice(0, placeAfter ? taskIndex + 1 : taskIndex);

    return tasksBeforeDrop.filter((task) => task.id !== draggedTask?.taskId)
      .length;
  }

  function getFinalDropPosition(tasks: Task[]) {
    return tasks.filter((task) => task.id !== draggedTask?.taskId).length;
  }

  function getDropPositionForTask(
    tasks: Task[],
    taskId: string,
    placeAfter: boolean
  ) {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return getFinalDropPosition(tasks);
    }

    return getDropPosition(tasks, taskIndex, placeAfter);
  }

  function isActiveDropTarget(columnId: string, position: number) {
    return (
      dragOverTarget?.columnId === columnId &&
      dragOverTarget.position === position
    );
  }

  function renderDropIndicator(columnId: string, position: number) {
    const active = isActiveDropTarget(columnId, position);

    return (
      <div
        onDragOver={(event) => handleDragOver(event, columnId, position)}
        onDrop={(event) => void handleDrop(event, columnId, position)}
        className={`transition-all duration-150 ${
          draggedTask ? "h-3" : "h-0"
        } ${active ? "h-8" : ""}`}
        aria-hidden="true"
      >
        <div
          className={`h-full rounded-lg border-2 border-dashed transition ${
            active
              ? "border-blue-300 bg-blue-50"
              : "border-transparent bg-transparent"
          }`}
        />
      </div>
    );
  }

  const dragDisabled = tasksLoading || movingTask;

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
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
          <div className="flex h-full min-h-0 w-max gap-4 pr-4">
            {columns.map((column) => {
              const tasks = tasksByColumn[column.id] ?? [];
              const moveTasks = moveTasksByColumn?.[column.id] ?? tasks;
              const finalDropPosition = getFinalDropPosition(moveTasks);
              const isDragOver = dragOverTarget?.columnId === column.id;

              return (
                <article
                  key={column.id}
                  onDragOver={(event) =>
                    handleDragOver(event, column.id, finalDropPosition)
                  }
                  onDrop={(event) =>
                    void handleDrop(event, column.id, finalDropPosition)
                  }
                  className={`flex h-full min-h-0 w-[320px] shrink-0 flex-col rounded-lg border p-4 transition ${
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
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="inline-flex min-h-7 items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600">
                        {tasks.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCreateTask(column.id)}
                        disabled={tasksLoading || movingTask}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Adicionar tarefa em ${column.name}`}
                        title="Adicionar tarefa"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  {tasksLoading && (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
                      Carregando tarefas...
                    </div>
                  )}

                  {!tasksLoading && tasks.length === 0 && (
                    <div
                      onDragOver={(event) => handleDragOver(event, column.id, 0)}
                      onDrop={(event) => void handleDrop(event, column.id, 0)}
                      className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500"
                    >
                      Nenhuma tarefa nesta coluna
                    </div>
                  )}

                  {!tasksLoading && tasks.length > 0 && (
                    <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto pr-1">
                      {tasks.map((task) => {
                        const dropBeforePosition = getDropPositionForTask(
                          moveTasks,
                          task.id,
                          false
                        );
                        const dropAfterPosition = getDropPositionForTask(
                          moveTasks,
                          task.id,
                          true
                        );

                        return (
                          <div key={task.id}>
                            {draggedTask?.taskId !== task.id &&
                              renderDropIndicator(
                                column.id,
                                dropBeforePosition
                              )}

                            <div
                              onDragOver={(event) => {
                                if (draggedTask?.taskId === task.id) {
                                  event.stopPropagation();
                                  return;
                                }

                                const rect =
                                  event.currentTarget.getBoundingClientRect();
                                const placeAfter =
                                  event.clientY > rect.top + rect.height / 2;
                                const nextPosition = placeAfter
                                  ? dropAfterPosition
                                  : dropBeforePosition;

                                handleDragOver(
                                  event,
                                  column.id,
                                  nextPosition
                                );
                              }}
                              onDrop={(event) => {
                                const nextPosition =
                                  dragOverTarget?.columnId === column.id
                                    ? dragOverTarget.position
                                    : dropBeforePosition;

                                void handleDrop(
                                  event,
                                  column.id,
                                  nextPosition
                                );
                              }}
                              className="py-1.5"
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
                          </div>
                        );
                      })}

                      {renderDropIndicator(column.id, finalDropPosition)}
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

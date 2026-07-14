"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getColumnTasksService,
  moveTaskService,
} from "../services/taskService";
import type { Column } from "../types/board";
import type { Task } from "../types/task";

export type TasksByColumn = Record<string, Task[]>;

type LoadTasksOptions = {
  silent?: boolean;
};

function sortTasksByPosition(tasks: Task[]) {
  return [...tasks].sort((first, second) => first.position - second.position);
}

function reindexTasks(tasks: Task[], columnId: string, columnName: string) {
  return tasks.map((task, position) => ({
    ...task,
    columnId,
    columnName,
    position,
  }));
}

export function useTasksByColumn(
  workspaceId: string,
  boardId: string | undefined,
  columns: Column[]
) {
  const [tasksByColumn, setTasksByColumn] = useState<TasksByColumn>({});
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async (options: LoadTasksOptions = {}) => {
    if (!boardId || columns.length === 0) {
      setTasksByColumn({});
      setLoading(false);
      return;
    }

    if (!options.silent) {
      setLoading(true);
    }

    setError("");

    try {
      const entries = await Promise.all(
        columns.map(async (column) => {
          const tasks = await getColumnTasksService(
            workspaceId,
            boardId,
            column.id
          );

          return [column.id, sortTasksByPosition(tasks)] as const;
        })
      );

      setTasksByColumn(Object.fromEntries(entries));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar tasks");
    } finally {
      if (!options.silent) {
        setLoading(false);
      }
    }
  }, [boardId, columns, workspaceId]);

  async function moveTask(
    taskId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetPosition?: number
  ) {
    if (!boardId || sourceColumnId === targetColumnId) {
      return false;
    }

    const sourceColumn = columns.find((column) => column.id === sourceColumnId);
    const targetColumn = columns.find((column) => column.id === targetColumnId);

    if (!sourceColumn || !targetColumn) {
      return false;
    }

    const previousTasksByColumn = tasksByColumn;
    const sourceTasks = previousTasksByColumn[sourceColumnId] ?? [];
    const targetTasks = previousTasksByColumn[targetColumnId] ?? [];
    const task = sourceTasks.find((item) => item.id === taskId);

    if (!task) {
      return false;
    }

    const nextPosition = Math.max(
      0,
      Math.min(targetPosition ?? targetTasks.length, targetTasks.length)
    );
    const nextSourceTasks = sourceTasks.filter((item) => item.id !== taskId);
    const nextTargetTasks = [...targetTasks];
    nextTargetTasks.splice(nextPosition, 0, {
      ...task,
      columnId: targetColumnId,
      columnName: targetColumn.name,
    });

    setError("");
    setTasksByColumn({
      ...previousTasksByColumn,
      [sourceColumnId]: reindexTasks(
        nextSourceTasks,
        sourceColumnId,
        sourceColumn.name
      ),
      [targetColumnId]: reindexTasks(
        nextTargetTasks,
        targetColumnId,
        targetColumn.name
      ),
    });
    setMoving(true);

    try {
      await moveTaskService(workspaceId, boardId, sourceColumnId, taskId, {
        targetColumnId,
        targetPosition: nextPosition,
      });
      await loadTasks({ silent: true });
      return true;
    } catch (err: unknown) {
      setTasksByColumn(previousTasksByColumn);
      setError(err instanceof Error ? err.message : "Erro ao mover task");
      return false;
    } finally {
      setMoving(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialTasks() {
      if (!boardId || columns.length === 0) {
        if (active) {
          setTasksByColumn({});
          setLoading(false);
        }

        return;
      }

      if (active) {
        setLoading(true);
        setError("");
      }

      try {
        const entries = await Promise.all(
          columns.map(async (column) => {
            const tasks = await getColumnTasksService(
              workspaceId,
              boardId,
              column.id
            );

            return [column.id, sortTasksByPosition(tasks)] as const;
          })
        );

        if (active) {
          setTasksByColumn(Object.fromEntries(entries));
        }
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao buscar tasks");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialTasks();

    return () => {
      active = false;
    };
  }, [boardId, columns, workspaceId]);

  return {
    tasksByColumn,
    loading,
    moving,
    error,
    loadTasks,
    moveTask,
  };
}

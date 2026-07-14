"use client";

import { useCallback, useEffect, useState } from "react";
import { getColumnTasksService } from "../services/taskService";
import type { Column } from "../types/board";
import type { Task } from "../types/task";

export type TasksByColumn = Record<string, Task[]>;

export function useTasksByColumn(
  workspaceId: string,
  boardId: string | undefined,
  columns: Column[]
) {
  const [tasksByColumn, setTasksByColumn] = useState<TasksByColumn>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    if (!boardId || columns.length === 0) {
      setTasksByColumn({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const entries = await Promise.all(
        columns.map(async (column) => {
          const tasks = await getColumnTasksService(
            workspaceId,
            boardId,
            column.id
          );

          return [
            column.id,
            [...tasks].sort((first, second) => first.position - second.position),
          ] as const;
        })
      );

      setTasksByColumn(Object.fromEntries(entries));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar tasks");
    } finally {
      setLoading(false);
    }
  }, [boardId, columns, workspaceId]);

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

            return [
              column.id,
              [...tasks].sort(
                (first, second) => first.position - second.position
              ),
            ] as const;
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
    error,
    loadTasks,
  };
}

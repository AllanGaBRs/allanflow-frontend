"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createColumnService,
  deleteColumnService,
  getColumnsService,
  updateColumnService,
} from "../services/columnService";
import type { Column } from "../types/board";

type UseColumnsOptions = {
  initialColumns?: Column[];
};

export function useColumns(
  workspaceId: string,
  boardId: string | undefined,
  options: UseColumnsOptions = {}
) {
  const [columns, setColumns] = useState<Column[]>(options.initialColumns ?? []);
  const [loading, setLoading] = useState(Boolean(boardId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadColumns = useCallback(async () => {
    if (!boardId) {
      setColumns([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getColumnsService(workspaceId, boardId);
      setColumns(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar colunas");
    } finally {
      setLoading(false);
    }
  }, [boardId, workspaceId]);

  async function createColumn(name: string, position?: number) {
    if (!boardId) {
      return false;
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("O nome da coluna deve ter pelo menos 2 caracteres.");
      return false;
    }

    setSaving(true);
    setError("");

    try {
      await createColumnService(workspaceId, boardId, {
        name: trimmedName,
        position,
      });
      await loadColumns();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar coluna");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function updateColumn(columnId: string, name: string, position?: number) {
    if (!boardId) {
      return false;
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("O nome da coluna deve ter pelo menos 2 caracteres.");
      return false;
    }

    setSaving(true);
    setError("");

    try {
      await updateColumnService(workspaceId, boardId, columnId, {
        name: trimmedName,
        position,
      });
      await loadColumns();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar coluna");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteColumn(columnId: string) {
    if (!boardId) {
      return false;
    }

    setSaving(true);
    setError("");

    try {
      await deleteColumnService(workspaceId, boardId, columnId);
      await loadColumns();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao excluir coluna");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function moveColumn(columnId: string, direction: "left" | "right") {
    if (!boardId) {
      return false;
    }

    const currentIndex = columns.findIndex((column) => column.id === columnId);
    const targetIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= columns.length
    ) {
      return false;
    }

    const reorderedColumns = [...columns];
    const [movedColumn] = reorderedColumns.splice(currentIndex, 1);
    reorderedColumns.splice(targetIndex, 0, movedColumn);

    setSaving(true);
    setError("");

    try {
      await Promise.all(
        reorderedColumns.map((column, index) =>
          updateColumnService(workspaceId, boardId, column.id, {
            position: index,
          })
        )
      );
      await loadColumns();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao reordenar colunas");
      return false;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialColumns() {
      await Promise.resolve();

      if (!boardId) {
        if (active) {
          setColumns([]);
          setLoading(false);
        }

        return;
      }

      if (active) {
        setLoading(true);
        setError("");
      }

      try {
        const data = await getColumnsService(workspaceId, boardId);

        if (active) {
          setColumns(data);
        }
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao buscar colunas");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialColumns();

    return () => {
      active = false;
    };
  }, [boardId, workspaceId]);

  return {
    columns,
    loading,
    saving,
    error,
    createColumn,
    updateColumn,
    deleteColumn,
    moveColumn,
    loadColumns,
  };
}

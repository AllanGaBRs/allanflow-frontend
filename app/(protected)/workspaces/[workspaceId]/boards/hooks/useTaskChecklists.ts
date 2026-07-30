"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createTaskChecklistItemService,
  createTaskChecklistService,
  deleteTaskChecklistItemService,
  deleteTaskChecklistService,
  getTaskChecklistsService,
  updateTaskChecklistItemService,
  updateTaskChecklistService,
} from "../services/checklistService";
import type {
  Checklist,
  ChecklistItem,
  ChecklistItemUpdatePayload,
} from "../types/checklist";

function sortChecklistItems(checklist: Checklist) {
  return {
    ...checklist,
    items: [...checklist.items].sort(
      (first, second) => first.position - second.position
    ),
  };
}

function reindexChecklistItems(items: ChecklistItem[]) {
  return items.map((item, position) => ({
    ...item,
    position,
  }));
}

function upsertChecklistItem(items: ChecklistItem[], nextItem: ChecklistItem) {
  const itemsWithoutNext = items.filter((item) => item.id !== nextItem.id);
  const nextPosition = Math.max(
    0,
    Math.min(nextItem.position, itemsWithoutNext.length)
  );
  const nextItems = [...itemsWithoutNext];

  nextItems.splice(nextPosition, 0, nextItem);

  return reindexChecklistItems(nextItems);
}

export function useTaskChecklists(
  workspaceId: string,
  boardId?: string,
  columnId?: string,
  taskId?: string
) {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(Boolean(taskId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getTaskContext = useCallback(() => {
    if (!boardId || !columnId || !taskId) {
      return null;
    }

    return {
      boardId,
      columnId,
      taskId,
    };
  }, [boardId, columnId, taskId]);

  const loadChecklists = useCallback(async () => {
    const context = getTaskContext();

    if (!context) {
      setChecklists([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getTaskChecklistsService(
        workspaceId,
        context.boardId,
        context.columnId,
        context.taskId
      );

      setChecklists(data.map(sortChecklistItems));
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Erro ao buscar checklists"
      );
    } finally {
      setLoading(false);
    }
  }, [workspaceId, getTaskContext]);

  async function createChecklist(title: string) {
    const context = getTaskContext();

    if (!context) {
      return false;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 2) {
      setError("O título do checklist deve ter pelo menos 2 caracteres.");
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const createdChecklist = await createTaskChecklistService(
        workspaceId,
        context.boardId,
        context.columnId,
        context.taskId,
        {
          title: trimmedTitle,
        }
      );

      setChecklists((prev) => [...prev, sortChecklistItems(createdChecklist)]);
      return true;
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Erro ao criar checklist"
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function updateChecklist(checklistId: string, title: string) {
    const context = getTaskContext();

    if (!context) {
      return false;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 2) {
      setError("O título do checklist deve ter pelo menos 2 caracteres.");
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const updatedChecklist = await updateTaskChecklistService(
        workspaceId,
        context.boardId,
        context.columnId,
        context.taskId,
        checklistId,
        {
          title: trimmedTitle,
        }
      );

      setChecklists((prev) =>
        prev.map((checklist) =>
          checklist.id === checklistId
            ? sortChecklistItems(updatedChecklist)
            : checklist
        )
      );

      return true;
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Erro ao atualizar checklist"
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteChecklist(checklistId: string) {
    const context = getTaskContext();

    if (!context) {
      return false;
    }

    setSaving(true);
    setError("");

    try {
      await deleteTaskChecklistService(
        workspaceId,
        context.boardId,
        context.columnId,
        context.taskId,
        checklistId
      );

      setChecklists((prev) =>
        prev.filter((checklist) => checklist.id !== checklistId)
      );

      return true;
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Erro ao excluir checklist"
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function createChecklistItem(
    checklistId: string,
    content: string,
    position?: number | null
  ) {
    const context = getTaskContext();

    if (!context) {
      return false;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("O item do checklist não pode ser vazio.");
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const createdItem = await createTaskChecklistItemService(
        workspaceId,
        context.boardId,
        context.columnId,
        context.taskId,
        checklistId,
        {
          content: trimmedContent,
          position,
        }
      );

      setChecklists((prev) =>
        prev.map((checklist) =>
          checklist.id === checklistId
            ? {
                ...checklist,
                items: upsertChecklistItem(checklist.items, createdItem),
              }
            : checklist
        )
      );

      return true;
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Erro ao criar item do checklist"
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function updateChecklistItem(
    checklistId: string,
    itemId: string,
    payload: ChecklistItemUpdatePayload
  ) {
    const context = getTaskContext();

    if (!context) {
      return false;
    }

    const trimmedContent = payload.content?.trim();

    if (payload.content !== undefined && !trimmedContent) {
      setError("O item do checklist não pode ser vazio.");
      return false;
    }

    const nextPayload: ChecklistItemUpdatePayload = { ...payload };

    if (payload.content !== undefined) {
      nextPayload.content = trimmedContent;
    }

    setSaving(true);
    setError("");

    try {
      const updatedItem = await updateTaskChecklistItemService(
        workspaceId,
        context.boardId,
        context.columnId,
        context.taskId,
        checklistId,
        itemId,
        nextPayload
      );

      setChecklists((prev) =>
        prev.map((checklist) =>
          checklist.id === checklistId
            ? {
                ...checklist,
                items: upsertChecklistItem(checklist.items, updatedItem),
              }
            : checklist
        )
      );

      return true;
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar item do checklist"
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteChecklistItem(checklistId: string, itemId: string) {
    const context = getTaskContext();

    if (!context) {
      return false;
    }

    setSaving(true);
    setError("");

    try {
      await deleteTaskChecklistItemService(
        workspaceId,
        context.boardId,
        context.columnId,
        context.taskId,
        checklistId,
        itemId
      );

      setChecklists((prev) =>
        prev.map((checklist) =>
          checklist.id === checklistId
            ? {
                ...checklist,
                items: reindexChecklistItems(
                  checklist.items.filter((item) => item.id !== itemId)
                ),
              }
            : checklist
        )
      );

      return true;
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Erro ao excluir item do checklist"
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadChecklists();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadChecklists]);

  return {
    checklists,
    loading,
    saving,
    error,
    loadChecklists,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    createChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
  };
}

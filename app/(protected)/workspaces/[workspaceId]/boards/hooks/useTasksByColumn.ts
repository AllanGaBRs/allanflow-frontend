"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createTaskService,
  deleteTaskService,
  getColumnTasksService,
  getTaskService,
  moveTaskService,
  updateTaskService,
} from "../services/taskService";
import type { Column } from "../types/board";
import type {
  Task,
  TaskCreatePayload,
  TaskForm,
  TaskUpdatePayload,
} from "../types/task";

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

function toDateTimeLocalValue(dueDate: string | null) {
  if (!dueDate) {
    return "";
  }

  return dueDate.slice(0, 16);
}

function taskToForm(task: Task): TaskForm {
  return {
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    dueDate: toDateTimeLocalValue(task.dueDate),
    labelIds: task.labels.map((label) => label.id),
    assigneeIds: task.assignees.map((assignee) => assignee.id),
    clientId: task.client?.id ?? "",
  };
}

const initialTaskForm: TaskForm = {
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
  labelIds: [],
  assigneeIds: [],
  clientId: "",
};

export function useTasksByColumn(
  workspaceId: string,
  boardId: string | undefined,
  columns: Column[]
) {
  const [tasksByColumn, setTasksByColumn] = useState<TasksByColumn>({});
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);
  const [loadingTaskDetails, setLoadingTaskDetails] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);
  const [createColumnId, setCreateColumnId] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<TaskForm>(initialTaskForm);
  const [error, setError] = useState("");

  function replaceTaskInColumn(updatedTask: Task) {
    setTasksByColumn((currentTasksByColumn) => ({
      ...currentTasksByColumn,
      [updatedTask.columnId]: sortTasksByPosition(
        (currentTasksByColumn[updatedTask.columnId] ?? []).map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      ),
    }));
  }

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

  function closeTaskDetails() {
    setSelectedTask(null);
    setTaskForm(initialTaskForm);
    setError("");
  }

  function openTaskCreate(columnId: string) {
    setSelectedTask(null);
    setCreateColumnId(columnId);
    setTaskForm(initialTaskForm);
    setError("");
  }

  function closeTaskCreate() {
    setCreateColumnId("");
    setTaskForm(initialTaskForm);
    setError("");
  }

  async function openTaskDetails(task: Task) {
    if (!boardId) {
      return;
    }

    setSelectedTask(task);
    setTaskForm(taskToForm(task));
    setLoadingTaskDetails(true);
    setError("");

    try {
      const detailedTask = await getTaskService(
        workspaceId,
        boardId,
        task.columnId,
        task.id
      );
      setSelectedTask(detailedTask);
      setTaskForm(taskToForm(detailedTask));
      replaceTaskInColumn(detailedTask);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar task");
    } finally {
      setLoadingTaskDetails(false);
    }
  }

  function updateTaskForm<K extends keyof TaskForm>(
    field: K,
    value: TaskForm[K]
  ) {
    setTaskForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function taskPayloadFromForm(): TaskCreatePayload {
    return {
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      priority: taskForm.priority,
      dueDate: taskForm.dueDate || null,
      labels: taskForm.labelIds,
      assignees: taskForm.assigneeIds,
      client: taskForm.clientId || null,
    };
  }

  async function createTask() {
    if (!boardId || !createColumnId) {
      return false;
    }

    const payload = taskPayloadFromForm();

    if (payload.title.length < 2) {
      setError("O título da task deve ter pelo menos 2 caracteres.");
      return false;
    }

    setSavingTask(true);
    setError("");

    try {
      const createdTask = await createTaskService(
        workspaceId,
        boardId,
        createColumnId,
        payload
      );
      setTasksByColumn((currentTasksByColumn) => ({
        ...currentTasksByColumn,
        [createColumnId]: sortTasksByPosition([
          ...(currentTasksByColumn[createColumnId] ?? []),
          createdTask,
        ]),
      }));
      closeTaskCreate();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar task");
      return false;
    } finally {
      setSavingTask(false);
    }
  }

  async function updateSelectedTask() {
    if (!boardId || !selectedTask) {
      return false;
    }

    const trimmedTitle = taskForm.title.trim();

    if (trimmedTitle.length < 2) {
      setError("O título da task deve ter pelo menos 2 caracteres.");
      return false;
    }

    const payload: TaskUpdatePayload = taskPayloadFromForm();

    setSavingTask(true);
    setError("");

    try {
      const updatedTask = await updateTaskService(
        workspaceId,
        boardId,
        selectedTask.columnId,
        selectedTask.id,
        payload
      );
      setSelectedTask(updatedTask);
      setTaskForm(taskToForm(updatedTask));
      replaceTaskInColumn(updatedTask);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar task");
      return false;
    } finally {
      setSavingTask(false);
    }
  }

  async function deleteSelectedTask() {
    if (!boardId || !selectedTask) {
      return false;
    }

    const taskToDelete = selectedTask;
    setDeletingTask(true);
    setError("");

    try {
      await deleteTaskService(
        workspaceId,
        boardId,
        taskToDelete.columnId,
        taskToDelete.id
      );
      setTasksByColumn((currentTasksByColumn) => ({
        ...currentTasksByColumn,
        [taskToDelete.columnId]: (
          currentTasksByColumn[taskToDelete.columnId] ?? []
        ).filter((task) => task.id !== taskToDelete.id),
      }));
      closeTaskDetails();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao excluir task");
      return false;
    } finally {
      setDeletingTask(false);
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
    loadingTaskDetails,
    savingTask,
    deletingTask,
    selectedTask,
    createColumnId,
    taskForm,
    error,
    loadTasks,
    moveTask,
    openTaskDetails,
    openTaskCreate,
    closeTaskDetails,
    closeTaskCreate,
    updateTaskForm,
    updateSelectedTask,
    deleteSelectedTask,
    createTask,
  };
}

import { api } from "@/app/api/api";
import type { Task, TaskMovePayload, TaskUpdatePayload } from "../types/task";

function columnTasksUrl(
  workspaceId: string,
  boardId: string,
  columnId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks`;
}

export async function getColumnTasksService(
  workspaceId: string,
  boardId: string,
  columnId: string
): Promise<Task[]> {
  const { data } = await api.get<Task[]>(
    columnTasksUrl(workspaceId, boardId, columnId)
  );

  return data;
}

export async function moveTaskService(
  workspaceId: string,
  boardId: string,
  sourceColumnId: string,
  taskId: string,
  payload: TaskMovePayload
): Promise<Task> {
  const { data } = await api.patch<Task>(
    `${columnTasksUrl(workspaceId, boardId, sourceColumnId)}/${taskId}/move`,
    payload
  );

  return data;
}

export async function getTaskService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string
): Promise<Task> {
  const { data } = await api.get<Task>(
    `${columnTasksUrl(workspaceId, boardId, columnId)}/${taskId}`
  );

  return data;
}

export async function updateTaskService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  payload: TaskUpdatePayload
): Promise<Task> {
  const { data } = await api.put<Task>(
    `${columnTasksUrl(workspaceId, boardId, columnId)}/${taskId}`,
    payload
  );

  return data;
}

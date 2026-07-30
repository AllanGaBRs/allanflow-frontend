import { api } from "@/app/api/api";
import type {
  Task,
  TaskCreatePayload,
  TaskMovePayload,
  TaskUpdatePayload,
} from "../types/task";

function boardTasksUrl(
  workspaceId: string,
  boardId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/tasks`;
}

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

export async function createTaskService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  payload: TaskCreatePayload
): Promise<Task> {
  const { data } = await api.post<Task>(
    columnTasksUrl(workspaceId, boardId, columnId),
    payload
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

export async function getBoardTasksService(
  workspaceId: string,
  boardId: string
): Promise<Task[]> {
  const { data } = await api.get<Task[]>(
    boardTasksUrl(workspaceId, boardId)
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

export async function deleteTaskService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string
): Promise<void> {
  await api.delete(
    `${columnTasksUrl(workspaceId, boardId, columnId)}/${taskId}`
  );
}

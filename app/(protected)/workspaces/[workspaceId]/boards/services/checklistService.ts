import { api } from "@/app/api/api";
import type {
  Checklist,
  ChecklistCreatePayload,
  ChecklistItem,
  ChecklistItemCreatePayload,
  ChecklistItemUpdatePayload,
  ChecklistUpdatePayload,
} from "../types/checklist";

function taskChecklistsUrl(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}/checklists`;
}

function taskChecklistUrl(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string
) {
  return `${taskChecklistsUrl(workspaceId, boardId, columnId, taskId)}/${checklistId}`;
}

function taskChecklistItemsUrl(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string
) {
  return `${taskChecklistUrl(workspaceId, boardId, columnId, taskId, checklistId)}/items`;
}

function taskChecklistItemUrl(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string,
  itemId: string
) {
  return `${taskChecklistItemsUrl(workspaceId, boardId, columnId, taskId, checklistId)}/${itemId}`;
}

export async function getTaskChecklistsService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string
): Promise<Checklist[]> {
  const { data } = await api.get<Checklist[]>(
    taskChecklistsUrl(workspaceId, boardId, columnId, taskId)
  );

  return data;
}

export async function createTaskChecklistService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  payload: ChecklistCreatePayload
): Promise<Checklist> {
  const { data } = await api.post<Checklist>(
    taskChecklistsUrl(workspaceId, boardId, columnId, taskId),
    payload
  );

  return data;
}

export async function updateTaskChecklistService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string,
  payload: ChecklistUpdatePayload
): Promise<Checklist> {
  const { data } = await api.put<Checklist>(
    taskChecklistUrl(workspaceId, boardId, columnId, taskId, checklistId),
    payload
  );

  return data;
}

export async function deleteTaskChecklistService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string
): Promise<void> {
  await api.delete(
    taskChecklistUrl(workspaceId, boardId, columnId, taskId, checklistId)
  );
}

export async function createTaskChecklistItemService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string,
  payload: ChecklistItemCreatePayload
): Promise<ChecklistItem> {
  const { data } = await api.post<ChecklistItem>(
    taskChecklistItemsUrl(workspaceId, boardId, columnId, taskId, checklistId),
    payload
  );

  return data;
}

export async function updateTaskChecklistItemService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string,
  itemId: string,
  payload: ChecklistItemUpdatePayload
): Promise<ChecklistItem> {
  const { data } = await api.patch<ChecklistItem>(
    taskChecklistItemUrl(
      workspaceId,
      boardId,
      columnId,
      taskId,
      checklistId,
      itemId
    ),
    payload
  );

  return data;
}

export async function deleteTaskChecklistItemService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string,
  itemId: string
): Promise<void> {
  await api.delete(
    taskChecklistItemUrl(
      workspaceId,
      boardId,
      columnId,
      taskId,
      checklistId,
      itemId
    )
  );
}

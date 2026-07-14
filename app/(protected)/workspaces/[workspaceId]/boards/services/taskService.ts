import { api } from "@/app/api/api";
import type { Task } from "../types/task";

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

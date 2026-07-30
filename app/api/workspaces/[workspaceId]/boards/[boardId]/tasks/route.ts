export const runtime = "nodejs";

import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import {
  jsonResponse,
  normalizeListResponse,
} from "@/app/api/_utils/responses";
import { apiServer } from "@/app/api/api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
  }>;
};

type TaskResponse = {
  id: string;
  title: string;
  description: string | null;
  columnId: string;
  columnName: string;
  boardId: string;
  boardName: string;
  position: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  archived: boolean;
  dueDate: string | null;
  labels: unknown[];
  assignees: unknown[];
  client: unknown | null;
};

function boardTasksUrl(
  workspaceId: string,
  boardId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/tasks`;
}

export async function GET(
  req: Request,
  { params }: Params
) {
  const { workspaceId, boardId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      boardTasksUrl(workspaceId, boardId),
      { headers }
    );

    return jsonResponse(
      normalizeListResponse<TaskResponse, "tasks">(
        res.data,
        "tasks"
      )
    );
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar tarefas",
      statusMessages: {
        403: "Você não tem permissão para acessar este board.",
        404: "Board não encontrado.",
      },
    });
  }
}
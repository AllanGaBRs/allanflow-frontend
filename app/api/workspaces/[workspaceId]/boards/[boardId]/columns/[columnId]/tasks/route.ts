export const runtime = "nodejs";

import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import {
  createdResponse,
  jsonResponse,
  normalizeListResponse,
} from "@/app/api/_utils/responses";
import { apiServer } from "@/app/api/api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
    columnId: string;
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

function tasksUrl(workspaceId: string, boardId: string, columnId: string) {
  return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks`;
}

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      tasksUrl(workspaceId, boardId, columnId),
      { headers }
    );

    return jsonResponse(
      normalizeListResponse<TaskResponse, "tasks">(res.data, "tasks")
    );
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar tasks",
      statusMessages: {
        403: "Você não tem permissão para acessar estas tasks.",
        404: "Coluna ou board não encontrado.",
      },
    });
  }
}

export async function POST(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId } = await params;
  const body = await req.json();

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.post(
      tasksUrl(workspaceId, boardId, columnId),
      body,
      { headers }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao criar task",
      statusMessages: {
        403: "Você não tem permissão para criar tasks.",
        404: "Coluna, board, client, label ou responsável não encontrado.",
      },
    });
  }
}

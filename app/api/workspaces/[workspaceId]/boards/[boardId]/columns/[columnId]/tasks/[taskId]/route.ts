export const runtime = "nodejs";

import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { jsonResponse } from "@/app/api/_utils/responses";
import { apiServer } from "@/app/api/api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
    columnId: string;
    taskId: string;
  }>;
};

function taskUrl(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`;
}

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      taskUrl(workspaceId, boardId, columnId, taskId),
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar task",
      statusMessages: {
        403: "Você não tem permissão para acessar esta task.",
        404: "Task, coluna ou board não encontrado.",
      },
    });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId } = await params;
  const body = await req.json();

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.put(
      taskUrl(workspaceId, boardId, columnId, taskId),
      body,
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao atualizar task",
      statusMessages: {
        403: "Você não tem permissão para atualizar esta task.",
        404: "Task, coluna, board, client, label ou responsável não encontrado.",
      },
    });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    await apiServer.delete(
      taskUrl(workspaceId, boardId, columnId, taskId),
      { headers }
    );

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao excluir task",
      statusMessages: {
        403: "Você não tem permissão para excluir esta task.",
        404: "Task, coluna ou board não encontrado.",
      },
    });
  }
}

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
    commentId: string;
  }>;
};

function commentUrl(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  commentId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}/comments/${commentId}`;
}

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId, commentId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      commentUrl(workspaceId, boardId, columnId, taskId, commentId),
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar comentário",
      statusMessages: {
        403: "Você não tem permissão para acessar este comentário.",
        404: "Comentário, task, coluna ou board não encontrado.",
      },
    });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId, commentId } = await params;
  const body = await req.json();

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.put(
      commentUrl(workspaceId, boardId, columnId, taskId, commentId),
      body,
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao atualizar comentário",
      statusMessages: {
        403: "Você não tem permissão para atualizar este comentário.",
        404: "Comentário, task, coluna ou board não encontrado.",
      },
    });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId, commentId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    await apiServer.delete(
      commentUrl(workspaceId, boardId, columnId, taskId, commentId),
      { headers }
    );

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao excluir comentário",
      statusMessages: {
        403: "Você não tem permissão para excluir este comentário.",
        404: "Comentário, task, coluna ou board não encontrado.",
      },
    });
  }
}

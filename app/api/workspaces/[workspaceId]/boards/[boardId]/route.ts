export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { jsonResponse } from "@/app/api/_utils/responses";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      `/workspaces/${workspaceId}/boards/${boardId}`,
      {
        headers,
      }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar board",
      statusMessages: {
        403: "Você não tem permissão para acessar este board.",
        404: "Board não encontrado.",
      },
    });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;
  const parsed = await parseJsonBody<Record<string, unknown>>(req);

  if (!parsed.success) {
    return parsed.response;
  }

  const body = parsed.data;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.put(
      `/workspaces/${workspaceId}/boards/${boardId}`,
      body,
      {
        headers,
      }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao atualizar board",
      statusMessages: {
        403: "Você não tem permissão para atualizar este board.",
        404: "Board não encontrado.",
        409: "Já existe um board com este nome neste workspace.",
      },
    });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    await apiServer.delete(`/workspaces/${workspaceId}/boards/${boardId}`, {
      headers,
    });

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao excluir board",
      statusMessages: {
        403: "Você não tem permissão para excluir este board.",
        404: "Board não encontrado.",
      },
    });
  }
}

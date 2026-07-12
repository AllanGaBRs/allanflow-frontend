export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { jsonResponse } from "@/app/api/_utils/responses";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
    labelId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId, labelId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      `/workspaces/${workspaceId}/boards/${boardId}/labels/${labelId}`,
      {
        headers,
      }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar label",
      statusMessages: {
        403: "Você não tem permissão para acessar esta label.",
        404: "Label ou board não encontrado.",
      },
    });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const { workspaceId, boardId, labelId } = await params;
  const body = await req.json();

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.put(
      `/workspaces/${workspaceId}/boards/${boardId}/labels/${labelId}`,
      body,
      {
        headers,
      }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao atualizar label",
      statusMessages: {
        403: "Você não tem permissão para atualizar esta label.",
        404: "Label ou board não encontrado.",
      },
    });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, boardId, labelId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    await apiServer.delete(
      `/workspaces/${workspaceId}/boards/${boardId}/labels/${labelId}`,
      {
        headers,
      }
    );

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao excluir label",
      statusMessages: {
        403: "Você não tem permissão para excluir esta label.",
        404: "Label ou board não encontrado.",
      },
    });
  }
}

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
    documentId: string;
  }>;
};

function documentUrl(
  workspaceId: string,
  boardId: string,
  documentId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/documents/${documentId}`;
}

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId, documentId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      documentUrl(workspaceId, boardId, documentId),
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar documento",
      statusMessages: {
        403: "Você não tem permissão para acessar este documento.",
        404: "Documento ou board não encontrado.",
      },
    });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const { workspaceId, boardId, documentId } = await params;
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
      documentUrl(workspaceId, boardId, documentId),
      body,
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao atualizar documento",
      statusMessages: {
        400: "Dados inválidos para atualizar documento.",
        403: "Você não tem permissão para atualizar este documento.",
        404: "Documento ou board não encontrado.",
      },
    });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, boardId, documentId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    await apiServer.delete(
      documentUrl(workspaceId, boardId, documentId),
      { headers }
    );

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao excluir documento",
      statusMessages: {
        400: "Não é possível excluir uma pasta com documentos dentro.",
        403: "Você não tem permissão para excluir este documento.",
        404: "Documento ou board não encontrado.",
      },
    });
  }
}

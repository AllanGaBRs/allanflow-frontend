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

function documentMoveUrl(
  workspaceId: string,
  boardId: string,
  documentId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/documents/${documentId}/move`;
}

export async function PATCH(req: Request, { params }: Params) {
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

    const res = await apiServer.patch(
      documentMoveUrl(workspaceId, boardId, documentId),
      body,
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao mover documento",
      statusMessages: {
        400: "Não é possível mover o documento para este destino.",
        403: "Você não tem permissão para mover este documento.",
        404: "Documento, pasta de destino ou board não encontrado.",
      },
    });
  }
}

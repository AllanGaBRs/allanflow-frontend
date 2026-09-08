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
  }>;
};

function documentsTreeUrl(workspaceId: string, boardId: string) {
  return `/workspaces/${workspaceId}/boards/${boardId}/documents/tree`;
}

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      documentsTreeUrl(workspaceId, boardId),
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar árvore de documentos",
      statusMessages: {
        403: "Você não tem permissão para acessar os documentos deste board.",
        404: "Board não encontrado.",
      },
    });
  }
}

export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { createdResponse } from "@/app/api/_utils/responses";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
  }>;
};

function documentsUrl(workspaceId: string, boardId: string) {
  return `/workspaces/${workspaceId}/boards/${boardId}/documents`;
}

export async function POST(req: Request, { params }: Params) {
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

    const res = await apiServer.post(
      documentsUrl(workspaceId, boardId),
      body,
      { headers }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao criar documento",
      statusMessages: {
        400: "Dados inválidos para criar documento.",
        403: "Você não tem permissão para criar documentos neste board.",
        404: "Board ou pasta não encontrado.",
      },
    });
  }
}

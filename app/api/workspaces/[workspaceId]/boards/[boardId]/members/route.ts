export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { createdResponse, jsonResponse } from "@/app/api/_utils/responses";

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
      `/workspaces/${workspaceId}/boards/${boardId}/members`,
      {
        headers,
      }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar membros do board",
      statusMessages: {
        403: "Você não tem permissão para acessar estes membros.",
        404: "Board não encontrado.",
      },
    });
  }
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
      `/workspaces/${workspaceId}/boards/${boardId}/members`,
      body,
      {
        headers,
      }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao adicionar membro ao board",
      statusMessages: {
        403: "Você não tem permissão para adicionar membros ao board.",
        404: "Board ou membro não encontrado.",
        409: "Este usuário já faz parte do board.",
      },
    });
  }
}

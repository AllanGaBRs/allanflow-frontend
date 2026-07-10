export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { createdResponse, jsonResponse } from "@/app/api/_utils/responses";

type Params = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  const { workspaceId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(`/workspaces/${workspaceId}/members`, {
      headers,
    });

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar membros",
      statusMessages: {
        403: "Você não tem permissão para acessar estes membros.",
      },
    });
  }
}

export async function POST(req: Request, { params }: Params) {
  const { workspaceId } = await params;
  const body = await req.json();

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.post(
      `/workspaces/${workspaceId}/members`,
      body,
      {
        headers,
      }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao adicionar membro",
      statusMessages: {
        403: "Você não tem permissão para adicionar membros.",
        404: "Usuário ou workspace não encontrado.",
        409: "Este usuário já faz parte do workspace.",
      },
    });
  }
}

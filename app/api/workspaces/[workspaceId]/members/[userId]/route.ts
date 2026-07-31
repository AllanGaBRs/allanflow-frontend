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
    userId: string;
  }>;
};

export async function PUT(req: Request, { params }: Params) {
  const { workspaceId, userId } = await params;
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
      `/workspaces/${workspaceId}/members/${userId}`,
      body,
      {
        headers,
      }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao atualizar membro",
      statusMessages: {
        403: "Você não tem permissão para atualizar este membro.",
        404: "Membro não encontrado.",
      },
    });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, userId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    await apiServer.delete(`/workspaces/${workspaceId}/members/${userId}`, {
      headers,
    });

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao remover membro",
      statusMessages: {
        403: "Você não tem permissão para remover este membro.",
        404: "Membro não encontrado.",
      },
    });
  }
}

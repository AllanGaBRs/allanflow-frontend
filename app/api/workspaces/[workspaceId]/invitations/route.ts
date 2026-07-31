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
  }>;
};

export async function POST(req: Request, { params }: Params) {
  const { workspaceId } = await params;
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

    await apiServer.post(`/workspaces/${workspaceId}/invitations`, body, {
      headers,
    });

    return jsonResponse({ success: true });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Não foi possível enviar o convite.",
      statusMessages: {
        403: "Você não tem permissão para convidar membros.",
        404: "Workspace ou usuário não encontrado.",
      },
    });
  }
}

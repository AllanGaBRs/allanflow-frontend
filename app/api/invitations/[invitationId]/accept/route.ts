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
    invitationId: string;
  }>;
};

export async function POST(req: Request, { params }: Params) {
  const { invitationId } = await params;
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

    await apiServer.post(`/invitations/${invitationId}/accept`, body, {
      headers,
    });

    return jsonResponse({ success: true });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Não foi possível aceitar o convite.",
      statusMessages: {
        401: "Sessão encerrada. Faça login novamente.",
        404: "Convite não encontrado.",
      },
    });
  }
}

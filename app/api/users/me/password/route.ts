export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { jsonResponse } from "@/app/api/_utils/responses";

export async function PATCH(req: Request) {
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

    await apiServer.patch("/users/me/password", body, { headers });

    return jsonResponse({ success: true });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao alterar senha",
      statusMessages: {
        400: "Senha atual inválida ou nova senha fora do padrão.",
        403: "Você não tem permissão para alterar esta senha.",
      },
    });
  }
}

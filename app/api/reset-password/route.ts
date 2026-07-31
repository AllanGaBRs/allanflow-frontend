export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { jsonResponse } from "@/app/api/_utils/responses";

type ResetPasswordDTO = {
  email: string;
  code: string;
  newPassword: string;
};

export async function POST(req: Request) {
  const parsed = await parseJsonBody<ResetPasswordDTO>(req);

  if (!parsed.success) {
    return parsed.response;
  }

  const { email, code, newPassword } = parsed.data;

  try {
    await apiServer.post("/auth/reset-password", {
      email,
      code,
      newPassword,
    });

    return jsonResponse({ success: true });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Não foi possível redefinir a senha.",
      statusMessages: {
        400: "Código inválido ou expirado. Solicite um novo código.",
      },
    });
  }
}

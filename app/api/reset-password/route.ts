export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { jsonResponse } from "@/app/api/_utils/responses";

export async function POST(req: Request) {
  const { email, code, newPassword } = await req.json();

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

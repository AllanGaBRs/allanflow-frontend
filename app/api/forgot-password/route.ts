export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { jsonResponse } from "@/app/api/_utils/responses";

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    await apiServer.post("/auth/forgot-password", { email });

    return jsonResponse({ success: true });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Não foi possível enviar o código de recuperação.",
    });
  }
}

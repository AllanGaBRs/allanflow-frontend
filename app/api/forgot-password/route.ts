export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { jsonResponse } from "@/app/api/_utils/responses";

type ForgotPasswordDTO = {
  email: string;
};

export async function POST(req: Request) {
  const parsed = await parseJsonBody<ForgotPasswordDTO>(req);

  if (!parsed.success) {
    return parsed.response;
  }

  const { email } = parsed.data;

  try {
    await apiServer.post("/auth/forgot-password", { email });

    return jsonResponse({ success: true });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Não foi possível enviar o código de recuperação.",
    });
  }
}

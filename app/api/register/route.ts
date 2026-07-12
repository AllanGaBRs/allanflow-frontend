export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { createdResponse } from "@/app/api/_utils/responses";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  try {
    const res = await apiServer.post("/users", {
      name,
      email,
      password,
    });

    return createdResponse({
      success: true,
      user: res.data,
    });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao criar conta",
      statusMessages: {
        409: "Já existe uma conta com este email.",
      },
    });
  }
}

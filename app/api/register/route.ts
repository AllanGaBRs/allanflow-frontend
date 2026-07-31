export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { createdResponse } from "@/app/api/_utils/responses";

type RegisterDTO = {
  name: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  const parsed = await parseJsonBody<RegisterDTO>(req);

  if (!parsed.success) {
    return parsed.response;
  }

  const { name, email, password } = parsed.data;

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

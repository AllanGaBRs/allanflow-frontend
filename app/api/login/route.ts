export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { apiServer } from "@/app/api/api-server";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";

type LoginDTO = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  const parsed = await parseJsonBody<LoginDTO>(req);

  if (!parsed.success) {
    return parsed.response;
  }

  const body = parsed.data;

  try {
    const res = await apiServer.post("/auth/login", body);

    const response = NextResponse.json({
      success: true,
      user: res.data,
    });

    const setCookie = res.headers["set-cookie"];

    if (setCookie) {
      for (const cookie of setCookie) {
        response.headers.append("set-cookie", cookie);
      }
    }

    return response;
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro na autenticação",
      statusMessages: {
        400: "Email ou senha inválidos.",
        401: "Email ou senha inválidos.",
      },
    });
  }
}

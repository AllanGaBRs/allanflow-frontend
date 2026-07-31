export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { jsonResponse } from "@/app/api/_utils/responses";

type AIChatRequest = {
  message: string;
};

type AIChatResponse = {
  answer: string;
};

export async function POST(req: Request) {
  const parsed = await parseJsonBody<Partial<AIChatRequest>>(req);

  if (!parsed.success) {
    return parsed.response;
  }

  const body = parsed.data;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const response = await apiServer.post<AIChatResponse>("/ai/chat", body, {
      headers,
    });

    return jsonResponse(response.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao conversar com o assistente.",
      statusMessages: {
        400: "Escreva uma mensagem válida para o assistente.",
        403: "Você não tem permissão para usar o assistente.",
        502: "O assistente está indisponível no momento.",
      },
    });
  }
}

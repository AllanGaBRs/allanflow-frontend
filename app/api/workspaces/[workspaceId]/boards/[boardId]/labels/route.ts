export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import {
  createdResponse,
  jsonResponse,
  normalizeListResponse,
} from "@/app/api/_utils/responses";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
  }>;
};

type LabelResponse = {
  id: string;
  name: string;
  color: string;
};

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      `/workspaces/${workspaceId}/boards/${boardId}/labels`,
      {
        headers,
      }
    );

    return jsonResponse(
      normalizeListResponse<LabelResponse, "labels">(res.data, "labels")
    );
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar labels",
      statusMessages: {
        403: "Você não tem permissão para acessar estas labels.",
        404: "Board não encontrado.",
      },
    });
  }
}

export async function POST(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;
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

    const res = await apiServer.post(
      `/workspaces/${workspaceId}/boards/${boardId}/labels`,
      body,
      {
        headers,
      }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao criar label",
      statusMessages: {
        403: "Você não tem permissão para criar labels.",
        404: "Board não encontrado.",
      },
    });
  }
}

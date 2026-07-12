export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import {
  createdResponse,
  jsonResponse,
  normalizeListResponse,
} from "@/app/api/_utils/responses";

type Params = {
  params: Promise<{
    workspaceId: string;
  }>;
};

type BoardResponse = {
  id: string;
  name: string;
  description: string | null;
  columns: unknown[];
};

export async function GET(req: Request, { params }: Params) {
  const { workspaceId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(`/workspaces/${workspaceId}/boards`, {
      headers,
    });

    return jsonResponse(
      normalizeListResponse<BoardResponse, "boards">(res.data, "boards")
    );
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar boards",
      statusMessages: {
        403: "Você não tem permissão para acessar estes boards.",
      },
    });
  }
}

export async function POST(req: Request, { params }: Params) {
  const { workspaceId } = await params;
  const body = await req.json();

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.post(
      `/workspaces/${workspaceId}/boards`,
      body,
      {
        headers,
      }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao criar board",
      statusMessages: {
        403: "Você não tem permissão para criar boards.",
        409: "Já existe um board com este nome neste workspace.",
      },
    });
  }
}

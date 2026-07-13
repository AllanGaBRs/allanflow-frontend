export const runtime = "nodejs";

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
import { apiServer } from "@/app/api/api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
  }>;
};

type ClientResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export async function GET(req: Request, { params }: Params) {
  const { workspaceId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(`/workspaces/${workspaceId}/clients`, {
      headers,
    });

    return jsonResponse(
      normalizeListResponse<ClientResponse, "clients">(res.data, "clients")
    );
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar clientes",
      statusMessages: {
        403: "Você não tem permissão para acessar estes clientes.",
        404: "Workspace não encontrado.",
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
      `/workspaces/${workspaceId}/clients`,
      body,
      {
        headers,
      }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao criar cliente",
      statusMessages: {
        403: "Você não tem permissão para criar clientes.",
        404: "Workspace não encontrado.",
        409: "Já existe um cliente com estes dados.",
      },
    });
  }
}

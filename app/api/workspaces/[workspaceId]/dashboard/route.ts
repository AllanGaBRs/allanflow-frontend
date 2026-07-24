export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { jsonResponse } from "@/app/api/_utils/responses";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/api/workspaces/[workspaceId]/dashboard">
) {
  const { workspaceId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const response = await apiServer.get(
      `/workspaces/${workspaceId}/dashboard`,
      { headers }
    );

    return jsonResponse(response.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar indicadores",
      statusMessages: {
        403: "Você não tem permissão para acessar este dashboard.",
        404: "Workspace não encontrado.",
      },
    });
  }
}

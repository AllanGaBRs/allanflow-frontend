export const runtime = "nodejs";

import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { jsonResponse } from "@/app/api/_utils/responses";
import { apiServer } from "@/app/api/api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
    columnId: string;
    taskId: string;
  }>;
};

export async function PATCH(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId } = await params;
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

    const res = await apiServer.patch(
      `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}/move`,
      body,
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao mover task",
      statusMessages: {
        403: "Você não tem permissão para mover esta task.",
        404: "Task, coluna de origem, coluna de destino ou board não encontrado.",
      },
    });
  }
}

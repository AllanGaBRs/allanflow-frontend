export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
    userId: string;
  }>;
};

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, boardId, userId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    await apiServer.delete(
      `/workspaces/${workspaceId}/boards/${boardId}/members/${userId}`,
      {
        headers,
      }
    );

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao remover membro do board",
      statusMessages: {
        403: "Você não tem permissão para remover membros do board.",
        404: "Board ou membro não encontrado.",
      },
    });
  }
}

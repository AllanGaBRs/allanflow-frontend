export const runtime = "nodejs";

import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { createdResponse } from "@/app/api/_utils/responses";
import { apiServer } from "@/app/api/api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
    columnId: string;
    taskId: string;
    checklistId: string;
  }>;
};

function checklistItemsUrl(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}/checklists/${checklistId}/items`;
}

export async function POST(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId, checklistId } = await params;
  const body = await req.json();

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.post(
      checklistItemsUrl(workspaceId, boardId, columnId, taskId, checklistId),
      body,
      { headers }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao criar item do checklist",
      statusMessages: {
        403: "Você não tem permissão para criar itens neste checklist.",
        404: "Checklist, task, coluna ou board não encontrado.",
      },
    });
  }
}

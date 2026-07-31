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
    checklistId: string;
    itemId: string;
  }>;
};

function checklistItemUrl(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string,
  checklistId: string,
  itemId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}/checklists/${checklistId}/items/${itemId}`;
}

export async function PATCH(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId, checklistId, itemId } =
    await params;
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
      checklistItemUrl(
        workspaceId,
        boardId,
        columnId,
        taskId,
        checklistId,
        itemId
      ),
      body,
      { headers }
    );

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao atualizar item do checklist",
      statusMessages: {
        403: "Você não tem permissão para atualizar este item.",
        404: "Item, checklist, task, coluna ou board não encontrado.",
      },
    });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId, checklistId, itemId } =
    await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    await apiServer.delete(
      checklistItemUrl(
        workspaceId,
        boardId,
        columnId,
        taskId,
        checklistId,
        itemId
      ),
      { headers }
    );

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao excluir item do checklist",
      statusMessages: {
        403: "Você não tem permissão para excluir este item.",
        404: "Item, checklist, task, coluna ou board não encontrado.",
      },
    });
  }
}

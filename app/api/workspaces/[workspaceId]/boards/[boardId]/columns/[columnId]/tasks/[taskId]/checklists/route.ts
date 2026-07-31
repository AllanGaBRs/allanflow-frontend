export const runtime = "nodejs";

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
import { apiServer } from "@/app/api/api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
    columnId: string;
    taskId: string;
  }>;
};

type ChecklistItemResponse = {
  id: string;
  content: string;
  checked: boolean;
  position: number;
};

type ChecklistResponse = {
  id: string;
  title: string;
  taskId: string;
  items: ChecklistItemResponse[];
};

function checklistsUrl(
  workspaceId: string,
  boardId: string,
  columnId: string,
  taskId: string
) {
  return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}/checklists`;
}

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId, columnId, taskId } = await params;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get(
      checklistsUrl(workspaceId, boardId, columnId, taskId),
      { headers }
    );

    return jsonResponse(
      normalizeListResponse<ChecklistResponse, "checklists">(
        res.data,
        "checklists"
      )
    );
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar checklists",
      statusMessages: {
        403: "Você não tem permissão para acessar estes checklists.",
        404: "Task, coluna ou board não encontrado.",
      },
    });
  }
}

export async function POST(req: Request, { params }: Params) {
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

    const res = await apiServer.post(
      checklistsUrl(workspaceId, boardId, columnId, taskId),
      body,
      { headers }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao criar checklist",
      statusMessages: {
        403: "Você não tem permissão para criar checklists nesta task.",
        404: "Task, coluna ou board não encontrado.",
      },
    });
  }
}

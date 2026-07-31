import { getAuthorizationHeader, unauthorizedResponse } from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { createdResponse, jsonResponse, normalizeListResponse } from "@/app/api/_utils/responses";
import { apiServer } from "@/app/api/api-server";

export const runtime = "nodejs";

type Params = {
    params: Promise<{
        workspaceId: string;
        boardId: string;
        columnId: string;
        taskId: string;
    }>;
};

type CommentResponse = {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    taskId: string;
    createdAt: string;
};

function commentsUrl(
    workspaceId: string,
    boardId: string,
    columnId: string,
    taskId: string
) {
    return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}/comments`;
}

export async function GET(req: Request, { params }: Params) {
    const { workspaceId, boardId, columnId, taskId } = await params;

    try {
        const headers = await getAuthorizationHeader();

        if(!headers){
            return unauthorizedResponse();
        }

        const res = await apiServer.get(
            commentsUrl(workspaceId, boardId, columnId, taskId),
            {
                headers,
            }
        );

        return jsonResponse(
            normalizeListResponse<CommentResponse, "comments">(res.data, "comments")
        );
    } catch (error: unknown){
        return backendErrorResponse(error, {
            fallback: "Erro ao buscar comentários",
            statusMessages: {
                403: "Você não tem permissão para acessar estes comentários.",
                404: "Task, coluna ou board não encontrado."
            }
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
            commentsUrl(workspaceId, boardId, columnId, taskId),
            body,
            {
                headers,
            }
        );

        return createdResponse(res.data);
    } catch (error: unknown) {
        return backendErrorResponse(error, {
            fallback: "Erro ao criar comentário",
            statusMessages: {
                403: "Você não tem permissão para criar comentários nesta task.",
                404: "Task, coluna ou board não encontrado.",
            },
        });
    }
}

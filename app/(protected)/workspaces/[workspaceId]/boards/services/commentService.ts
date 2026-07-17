import { api } from "@/app/api/api";
import type {
    Comment,
    CommentCreatePayload,
    CommentUpdatePayload,
} from "../types/comment";

function taskCommentsUrl(
    workspaceId: string,
    boardId: string,
    columnId: string,
    taskId: string
) {
    return `/workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}/comments`;
}

export async function getTaskCommentsService(
    workspaceId: string,
    boardId: string,
    columnId: string,
    taskId: string
): Promise<Comment[]> {
    const { data } = await api.get<Comment[]>(
        taskCommentsUrl(workspaceId, boardId, columnId, taskId)
    );

    return data;
}

export async function createTaskCommentService(
    workspaceId: string,
    boardId: string,
    columnId: string,
    taskId: string,
    payload: CommentCreatePayload
): Promise<Comment> {
    const { data } = await api.post<Comment>(
        taskCommentsUrl(workspaceId, boardId, columnId, taskId),
        payload
    );

    return data;
}

export async function updateTaskCommentService(
    workspaceId: string,
    boardId: string,
    columnId: string,
    taskId: string,
    commentId: string,
    payload: CommentUpdatePayload
): Promise<Comment> {
    const { data } = await api.put<Comment>(
        `${taskCommentsUrl(workspaceId, boardId, columnId, taskId)}/${commentId}`,
        payload
    );

    return data;
}

export async function deleteTaskCommentService(
    workspaceId: string,
    boardId: string,
    columnId: string,
    taskId: string,
    commentId: string
): Promise<void> {
    await api.delete(
        `${taskCommentsUrl(workspaceId, boardId, columnId, taskId)}/${commentId}`
    );
}
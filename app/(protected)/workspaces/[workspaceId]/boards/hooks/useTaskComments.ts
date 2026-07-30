"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createTaskCommentService,
  deleteTaskCommentService,
  getTaskCommentsService,
  updateTaskCommentService,
} from "../services/commentService";
import type { Comment } from "../types/comment";

export function useTaskComments(
    workspaceId: string,
    boardId?: string,
    columnId?: string,
    taskId?: string
) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(Boolean(taskId));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const getTaskContext = useCallback(() => {
        if (!boardId || !columnId || !taskId) {
            return null;
        }

        return {
            boardId,
            columnId,
            taskId,
        };
    }, [boardId, columnId, taskId]);

    const loadComments = useCallback(async () => {
        const context = getTaskContext();

        if (!context) {
            setComments([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await getTaskCommentsService(
                workspaceId,
                context.boardId,
                context.columnId,
                context.taskId
            );

            setComments(data);
        } catch (error: unknown) {
            setError(
                error instanceof Error ? error.message : "Erro ao buscar comentários"
            );
        } finally {
            setLoading(false);
        }
    }, [workspaceId, getTaskContext]);

    async function createComment(content: string) {
        const context = getTaskContext();

        if (!context) {
            return false;
        }

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            setError("Escreva um comentário antes de enviar.");
            return false;
        }

        setSaving(true);
        setError("");

        try {
            const createdComment = await createTaskCommentService(
                workspaceId,
                context.boardId,
                context.columnId,
                context.taskId,
                {
                    content: trimmedContent,
                }
            );

            setComments((prev) => [...prev, createdComment]);
            return true;
        } catch (error: unknown) {
            setError(
                error instanceof Error ? error.message : "Erro ao criar comentário"
            );
            return false;
        } finally {
            setSaving(false);
        }
    }

    async function updateComment(commentId: string, content: string) {
        const context = getTaskContext();

        if (!context) {
            return false;
        }

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            setError("Comentário não pode ser vazio");
            return false;
        }

        setSaving(true);
        setError("");

        try {
            const updatedComment = await updateTaskCommentService(
                workspaceId,
                context.boardId,
                context.columnId,
                context.taskId,
                commentId,
                {
                    content: trimmedContent,
                }
            );

            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId ? updatedComment : comment
                )
            );

            return true;
        } catch (error: unknown) {
            setError(
                error instanceof Error ? error.message : "Erro ao editar comentário"
            );
            return false;
        } finally {
            setSaving(false);
        }
    }

    async function deleteComment(commentId: string) {
        const context = getTaskContext();

        if (!context) {
            return false;
        }

        setSaving(true);
        setError("");

        try {
            await deleteTaskCommentService(
                workspaceId,
                context.boardId,
                context.columnId,
                context.taskId,
                commentId
            );

            setComments((prev) =>
                prev.filter((comment) => comment.id !== commentId)
            );

            return true;
        } catch (error: unknown) {
            setError(
                error instanceof Error ? error.message : "Erro ao excluir comentário"
            );
            return false;
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadComments();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [loadComments]);

    return {
        comments,
        loading,
        saving,
        error,
        loadComments,
        createComment,
        updateComment,
        deleteComment,
    };
}

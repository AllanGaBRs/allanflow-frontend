"use client";

import { useState } from "react";
import { Pencil, Send, Trash2, X } from "lucide-react";
import type { Comment } from "../types/comment";
import { TaskCommentDeleteModal } from "./TaskCommentDeleteModal";

type TaskCommentsSectionProps = {
    comments: Comment[];
    loading: boolean;
    saving: boolean;
    error: string;
    currentUserId?: string;
    canManageComments: boolean;
    onCreateComment: (content: string) => Promise<boolean>;
    onUpdateComment: (commentId: string, content: string) => Promise<boolean>;
    onDeleteComment: (commentId: string) => Promise<boolean>;
};

export function TaskCommentsSection({
    comments,
    loading,
    saving,
    error,
    currentUserId,
    canManageComments,
    onCreateComment,
    onUpdateComment,
    onDeleteComment,
}: TaskCommentsSectionProps) {
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

    async function handleCreateComment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const created = await onCreateComment(newComment);

        if (created) {
            setNewComment("");
        }
    }

    async function handleUpdateComment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!editingCommentId) {
            return;
        }

        const updated = await onUpdateComment(editingCommentId, editingContent);

        if (updated) {
            setEditingCommentId(null);
            setEditingContent("");
        }
    }

    return (
        <section className="flex h-full min-h-0 flex-col">
            {error && (
                <div className="mb-4 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                {loading && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        Carregando comentários...
                    </div>
                )}

                {!loading && comments.length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                        Nenhum comentário ainda.
                    </div>
                )}

                {!loading && comments.length > 0 && (
                    <div className="grid gap-3">
                        {comments.map((comment) => {
                            const canEdit = comment.authorId === currentUserId;
                            const canDelete = comment.authorId === currentUserId || canManageComments;

                            return (
                                <article
                                    key={comment.id}
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                                >
                                    <div className="mb-2 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-950">
                                                {comment.authorName}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {new Date(comment.createdAt).toLocaleString("pt-BR")}
                                            </p>
                                        </div>

                                        {(canEdit || canDelete) && (
                                            <div className="flex shrink-0 gap-2">
                                                {canEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingCommentId(comment.id);
                                                            setEditingContent(comment.content);
                                                        }}
                                                        disabled={saving}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                        aria-label="Editar comentário"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                )}

                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setCommentToDelete(comment)}
                                                        disabled={saving}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        aria-label="Excluir comentário"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {editingCommentId === comment.id ? (
                                        <form onSubmit={handleUpdateComment} className="grid gap-2">
                                            <textarea
                                                value={editingContent}
                                                onChange={(event) => setEditingContent(event.target.value)}
                                                rows={3}
                                                maxLength={1000}
                                                disabled={saving}
                                                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                                            />

                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={saving || !editingContent.trim()}
                                                    className="inline-flex min-h-9 items-center justify-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    Salvar
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingCommentId(null);
                                                        setEditingContent("");
                                                    }}
                                                    disabled={saving}
                                                    className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <X size={15} />
                                                    Cancelar
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
                                            {comment.content}
                                        </p>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            <form onSubmit={handleCreateComment} className="mt-4 grid shrink-0 gap-3 border-t border-slate-200 pt-4">
                <textarea
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    rows={3}
                    maxLength={1000}
                    disabled={saving}
                    placeholder="Escreva um comentário..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                />

                <button
                    type="submit"
                    disabled={saving || !newComment.trim()}
                    className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Send size={16} />
                    {saving ? "Enviando..." : "Comentar"}
                </button>
            </form>

            {commentToDelete && (
                <TaskCommentDeleteModal
                    comment={commentToDelete}
                    loading={saving}
                    error={error}
                    onClose={() => setCommentToDelete(null)}
                    onConfirm={() => onDeleteComment(commentToDelete.id)}
                />
            )}
        </section>
    );
}

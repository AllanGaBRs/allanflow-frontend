"use client";

import { AlertCircle, Trash2, X } from "lucide-react";
import type { Comment } from "../types/comment";

type TaskCommentDeleteModalProps = {
  comment: Comment;
  loading: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
};

export function TaskCommentDeleteModal({
  comment,
  loading,
  error,
  onClose,
  onConfirm,
}: TaskCommentDeleteModalProps) {
  async function handleConfirm() {
    const deleted = await onConfirm();

    if (deleted) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-comment-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-red-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>
            <div className="min-w-0">
              <h2
                id="delete-comment-title"
                className="text-lg font-semibold text-slate-950"
              >
                Excluir comentário?
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Essa ação não pode ser desfeita.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          O comentário de <strong>{comment.authorName}</strong> será removido
          permanentemente.
        </p>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="min-h-11 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            {loading ? "Excluindo..." : "Excluir definitivamente"}
          </button>
        </div>
      </div>
    </div>
  );
}

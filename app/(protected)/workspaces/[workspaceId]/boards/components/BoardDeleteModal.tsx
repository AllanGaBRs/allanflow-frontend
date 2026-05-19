"use client";

import { Trash2, X } from "lucide-react";
import type { Board } from "../types/board";

type BoardDeleteModalProps = {
  board: Board;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
};

export function BoardDeleteModal({
  board,
  loading,
  onClose,
  onConfirm,
}: BoardDeleteModalProps) {
  async function handleConfirm() {
    const deleted = await onConfirm();

    if (deleted) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-board-title"
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

            <div>
              <h2
                id="delete-board-title"
                className="text-lg font-semibold text-slate-950"
              >
                Excluir board?
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

        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          O board {board.name} será removido permanentemente.
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
            onClick={handleConfirm}
            disabled={loading}
            className="min-h-11 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Excluindo..." : "Excluir definitivamente"}
          </button>
        </div>
      </div>
    </div>
  );
}

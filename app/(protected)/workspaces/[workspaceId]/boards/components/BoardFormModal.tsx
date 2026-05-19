"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { BoardCreatePayload } from "../types/board";

type BoardFormModalProps = {
  title: string;
  description: string;
  submitLabel: string;
  loading: boolean;
  initialName?: string;
  initialDescription?: string | null;
  includeEmptyDescription?: boolean;
  onClose: () => void;
  onSubmit: (payload: BoardCreatePayload) => Promise<boolean>;
};

export function BoardFormModal({
  title,
  description,
  submitLabel,
  loading,
  initialName = "",
  initialDescription = "",
  includeEmptyDescription = false,
  onClose,
  onSubmit,
}: BoardFormModalProps) {
  const [name, setName] = useState(initialName);
  const [boardDescription, setBoardDescription] = useState(
    initialDescription ?? ""
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const saved = await onSubmit({
      name,
      ...(includeEmptyDescription
        ? { description: boardDescription.trim() }
        : boardDescription.trim()
        ? { description: boardDescription.trim() }
        : {}),
    });

    if (saved) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="board-form-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="board-form-title"
              className="text-lg font-semibold text-slate-950"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="board-name"
            className="block text-sm font-semibold text-slate-800"
          >
            Nome do board
          </label>

          <input
            id="board-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={120}
            disabled={loading}
            autoFocus
            required
            className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
          />

          <label
            htmlFor="board-description"
            className="block text-sm font-semibold text-slate-800"
          >
            Descrição
          </label>

          <textarea
            id="board-description"
            value={boardDescription}
            onChange={(event) => setBoardDescription(event.target.value)}
            maxLength={255}
            disabled={loading}
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Salvando..." : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

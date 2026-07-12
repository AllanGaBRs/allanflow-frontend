"use client";

import { useState } from "react";
import { X } from "lucide-react";

type LabelFormModalProps = {
  loading: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => Promise<boolean>;
};

const DEFAULT_LABEL_COLOR = "#2563eb";

export function LabelFormModal({
  loading,
  onClose,
  onSubmit,
}: LabelFormModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_LABEL_COLOR);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const saved = await onSubmit(name, color);

    if (saved) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="label-form-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="label-form-title"
              className="text-lg font-semibold text-slate-950"
            >
              Nova label
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Crie um marcador para usar nas tasks deste board.
            </p>
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
            htmlFor="label-name"
            className="block text-sm font-semibold text-slate-800"
          >
            Nome da label
          </label>

          <input
            id="label-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={150}
            disabled={loading}
            autoFocus
            required
            className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
          />

          <label
            htmlFor="label-color"
            className="block text-sm font-semibold text-slate-800"
          >
            Cor
          </label>

          <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-3">
            <input
              id="label-color"
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              disabled={loading}
              className="h-11 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Selecionar cor da label"
            />

            <input
              type="text"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              maxLength={7}
              disabled={loading}
              placeholder="#2563eb"
              className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
              aria-label="Cor em hexadecimal"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Criar label"}
          </button>
        </form>
      </div>
    </div>
  );
}

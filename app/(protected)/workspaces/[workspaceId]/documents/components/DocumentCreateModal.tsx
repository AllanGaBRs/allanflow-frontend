"use client";

import { FileText, Folder, Plus, X } from "lucide-react";
import type { DocumentType } from "../types/document";

type FolderOption = {
  id: string;
  title: string;
  level: number;
};

type DocumentCreateModalProps = {
  title: string;
  type: DocumentType;
  parentId: string;
  folders: FolderOption[];
  loading: boolean;
  onTitleChange: (title: string) => void;
  onTypeChange: (type: DocumentType) => void;
  onParentChange: (parentId: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function DocumentCreateModal({
  title,
  type,
  parentId,
  folders,
  loading,
  onTitleChange,
  onTypeChange,
  onParentChange,
  onClose,
  onSubmit,
}: DocumentCreateModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-create-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="document-create-title"
              className="text-lg font-semibold text-slate-950"
            >
              Criar item
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Escolha o tipo e onde ele ficará na árvore.
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

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="document-title"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Nome
            </label>
            <input
              id="document-title"
              type="text"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              minLength={2}
              maxLength={255}
              disabled={loading}
              autoFocus
              required
              className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onTypeChange("FILE")}
                disabled={loading}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  type === "FILE"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <FileText size={16} />
                Documento
              </button>
              <button
                type="button"
                onClick={() => onTypeChange("FOLDER")}
                disabled={loading}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  type === "FOLDER"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Folder size={16} />
                Pasta
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="document-parent"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Pasta
            </label>
            <select
              id="document-parent"
              value={parentId}
              onChange={(event) => onParentChange(event.target.value)}
              disabled={loading}
              className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
            >
              <option value="">Raiz</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {"  ".repeat(folder.level)}
                  {folder.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="min-h-11 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || title.trim().length < 2}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              {loading ? "Criando..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

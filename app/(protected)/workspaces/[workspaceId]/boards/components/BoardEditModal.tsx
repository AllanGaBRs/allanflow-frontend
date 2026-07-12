"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useColumns } from "../hooks/useColumns";
import { ColumnDeleteModal } from "./ColumnDeleteModal";
import { ColumnFormModal } from "./ColumnFormModal";
import { LabelsManageSection } from "./LabelsManageSection";
import type { Board, BoardUpdatePayload, Column } from "../types/board";

type BoardEditModalProps = {
  workspaceId: string;
  board: Board;
  loading: boolean;
  onClose: () => void;
  onUpdateBoard: (payload: BoardUpdatePayload) => Promise<boolean>;
};

export function BoardEditModal({
  workspaceId,
  board,
  loading,
  onClose,
  onUpdateBoard,
}: BoardEditModalProps) {
  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description ?? "");
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [deletingColumn, setDeletingColumn] = useState<Column | null>(null);
  const {
    columns,
    loading: loadingColumns,
    saving: savingColumns,
    error: columnsError,
    createColumn,
    updateColumn,
    deleteColumn,
    moveColumn,
  } = useColumns(workspaceId, board.id, {
    initialColumns: board.columns,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onUpdateBoard({
      name,
      description,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="board-edit-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2
              id="board-edit-title"
              className="text-lg font-semibold text-slate-950"
            >
              Gerenciar board
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Atualize o board e suas colunas.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading || savingColumns}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div>
                <label
                  htmlFor="edit-board-name"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Nome
                </label>
                <input
                  id="edit-board-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  maxLength={120}
                  disabled={loading}
                  className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="edit-board-description"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Descrição
                </label>
                <input
                  id="edit-board-description"
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={255}
                  disabled={loading}
                  className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="min-h-11 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar board"}
            </button>
          </form>

          <LabelsManageSection workspaceId={workspaceId} boardId={board.id} />

          <div className="mt-8 border-t border-slate-200 pt-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-950">
                  Colunas
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Gerencie a estrutura deste board.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateColumnModalOpen(true)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Nova coluna
              </button>
            </div>

            {columnsError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {columnsError}
              </div>
            )}

            {loadingColumns && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Carregando colunas...
              </div>
            )}

            {!loadingColumns && columns.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Nenhuma coluna cadastrada.
              </div>
            )}

            {!loadingColumns && columns.length > 0 && (
              <div className="flex flex-col gap-2">
                {columns.map((column, index) => (
                  <div
                    key={column.id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {column.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Posição {column.position}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void moveColumn(column.id, "left")}
                        disabled={savingColumns || index === 0}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Mover coluna para esquerda"
                      >
                        <ArrowLeft size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => void moveColumn(column.id, "right")}
                        disabled={savingColumns || index === columns.length - 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Mover coluna para direita"
                      >
                        <ArrowRight size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingColumn(column)}
                        disabled={savingColumns}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Editar coluna"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingColumn(column)}
                        disabled={savingColumns}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Excluir coluna"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isCreateColumnModalOpen && (
        <ColumnFormModal
          title="Nova coluna"
          description="Crie uma coluna para este board."
          submitLabel="Criar"
          loading={savingColumns}
          onClose={() => setIsCreateColumnModalOpen(false)}
          onSubmit={createColumn}
        />
      )}

      {editingColumn && (
        <ColumnFormModal
          title="Editar coluna"
          description="Atualize o nome ou posição desta coluna."
          submitLabel="Salvar"
          loading={savingColumns}
          initialName={editingColumn.name}
          initialPosition={editingColumn.position}
          onClose={() => setEditingColumn(null)}
          onSubmit={(columnName, position) =>
            updateColumn(editingColumn.id, columnName, position)
          }
        />
      )}

      {deletingColumn && (
        <ColumnDeleteModal
          column={deletingColumn}
          loading={savingColumns}
          onClose={() => setDeletingColumn(null)}
          onConfirm={() => deleteColumn(deletingColumn.id)}
        />
      )}
    </div>
  );
}

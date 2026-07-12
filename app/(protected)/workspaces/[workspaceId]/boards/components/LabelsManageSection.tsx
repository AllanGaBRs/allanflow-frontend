"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useLabels } from "../hooks/useLabels";
import { LabelBadge } from "./LabelBadge";
import { LabelDeleteModal } from "./LabelDeleteModal";
import { LabelFormModal } from "./LabelFormModal";
import type { Label } from "../types/label";

type LabelsManageSectionProps = {
  workspaceId: string;
  boardId: string;
};

export function LabelsManageSection({
  workspaceId,
  boardId,
}: LabelsManageSectionProps) {
  const [isCreateLabelModalOpen, setIsCreateLabelModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<Label | null>(null);
  const {
    labels,
    loading,
    saving,
    error,
    createLabel,
    updateLabel,
    deleteLabel,
  } = useLabels(workspaceId, boardId);

  return (
    <div className="mt-8 border-t border-slate-200 pt-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Labels</h3>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie marcadores para organizar as futuras tasks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateLabelModalOpen(true)}
          disabled={saving}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} />
          Nova label
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Carregando labels...
        </div>
      )}

      {!loading && labels.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Nenhuma label cadastrada.
        </div>
      )}

      {!loading && labels.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {labels.map((label) => (
            <div
              key={label.id}
              className="flex min-w-0 flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <LabelBadge label={label} />

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLabel(label)}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Editar label"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingLabel(label)}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Excluir label"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateLabelModalOpen && (
        <LabelFormModal
          title="Nova label"
          description="Crie um marcador para usar nas tasks deste board."
          submitLabel="Criar label"
          loading={saving}
          onClose={() => setIsCreateLabelModalOpen(false)}
          onSubmit={createLabel}
        />
      )}

      {editingLabel && (
        <LabelFormModal
          title="Editar label"
          description="Atualize o nome ou a cor desta label."
          submitLabel="Salvar label"
          loading={saving}
          initialName={editingLabel.name}
          initialColor={editingLabel.color}
          onClose={() => setEditingLabel(null)}
          onSubmit={(labelName, color) =>
            updateLabel(editingLabel.id, labelName, color)
          }
        />
      )}

      {deletingLabel && (
        <LabelDeleteModal
          label={deletingLabel}
          loading={saving}
          onClose={() => setDeletingLabel(null)}
          onConfirm={() => deleteLabel(deletingLabel.id)}
        />
      )}
    </div>
  );
}

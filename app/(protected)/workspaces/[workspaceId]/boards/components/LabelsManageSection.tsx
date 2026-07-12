"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useLabels } from "../hooks/useLabels";
import { LabelBadge } from "./LabelBadge";
import { LabelFormModal } from "./LabelFormModal";

type LabelsManageSectionProps = {
  workspaceId: string;
  boardId: string;
};

export function LabelsManageSection({
  workspaceId,
  boardId,
}: LabelsManageSectionProps) {
  const [isCreateLabelModalOpen, setIsCreateLabelModalOpen] = useState(false);
  const { labels, loading, saving, error, createLabel } = useLabels(
    workspaceId,
    boardId
  );

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
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <LabelBadge key={label.id} label={label} />
          ))}
        </div>
      )}

      {isCreateLabelModalOpen && (
        <LabelFormModal
          loading={saving}
          onClose={() => setIsCreateLabelModalOpen(false)}
          onSubmit={createLabel}
        />
      )}
    </div>
  );
}

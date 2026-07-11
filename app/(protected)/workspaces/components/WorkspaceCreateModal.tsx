import { X } from "lucide-react";
import { WorkspaceCreateForm } from "./WorkspaceCreateForm";

type WorkspaceCreateModalProps = {
  name: string;
  loading: boolean;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function WorkspaceCreateModal({
  name,
  loading,
  onClose,
  onNameChange,
  onSubmit,
}: WorkspaceCreateModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-workspace-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="create-workspace-title"
              className="text-lg font-semibold text-slate-950"
            >
              Novo workspace
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Crie um ambiente para organizar tarefas e membros.
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

        <WorkspaceCreateForm
          name={name}
          loading={loading}
          onNameChange={onNameChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

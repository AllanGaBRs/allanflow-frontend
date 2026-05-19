"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Plus, X } from "lucide-react";
import { WorkspaceLayout } from "./WorkspaceLayout";
import { WorkspaceWelcome } from "./WorkspaceWelcome";
import { WorkspaceCreateForm } from "./WorkspaceCreateForm";
import { WorkspaceCard } from "./WorkspaceCard";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";
import { useWorkspaces } from "../hooks/useWorkspace";

export function WorkspaceDashboard() {
  const { workspaces, loading, creating, error, createWorkspace } =
    useWorkspaces();
  const [name, setName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await createWorkspace(name);

    if (created) {
      setName("");
      setIsCreateModalOpen(false);
    }
  }

  const closeCreateModal = useCallback(() => {
    if (creating) {
      return;
    }

    setName("");
    setIsCreateModalOpen(false);
  }, [creating]);

  useEffect(() => {
    if (!isCreateModalOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCreateModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCreateModal, isCreateModalOpen]);

  return (
    <WorkspaceLayout navVariant="workspaces">
      <section className="w-full px-6 py-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <WorkspaceWelcome totalWorkspaces={workspaces.length} />

          <div className="min-w-0">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Seus workspaces
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Todos os ambientes dos quais você faz parte.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:self-auto"
              >
                <Plus size={18} />
                Novo workspace
              </button>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {loading && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                Carregando workspaces...
              </div>
            )}

            {!loading && workspaces.length === 0 && <WorkspaceEmptyState />}

            {!loading && workspaces.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {workspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))}
              </div>
            )}
          </div>

          {isCreateModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-workspace-title"
              onClick={closeCreateModal}
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
                    onClick={closeCreateModal}
                    disabled={creating}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Fechar modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                <WorkspaceCreateForm
                  name={name}
                  loading={creating}
                  onNameChange={setName}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </WorkspaceLayout>
  );
}

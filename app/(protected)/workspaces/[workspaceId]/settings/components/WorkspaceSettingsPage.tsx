"use client";

import { useState } from "react";
import { CheckCircle2, Trash2, X } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useWorkspaceSettings } from "../hooks/useWorkspaceSettings";
import type { WorkspaceDetails } from "../../types/workspaceDetails";
import { useToastMessage } from "@/components/notifications/useToastMessage";

type WorkspaceSettingsPageProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetails | null;
  initialError: string;
};

export function WorkspaceSettingsPage({
  workspaceId,
  initialWorkspace,
  initialError,
}: WorkspaceSettingsPageProps) {
  const workspaceLoadError = initialWorkspace
    ? ""
    : initialError || "Não foi possível carregar o workspace.";
  useToastMessage(workspaceLoadError, { title: "Workspace" });

  if (!initialWorkspace) {
    return (
      <WorkspaceLayout
        workspaceId={workspaceId}
        headerTitle="Configurações"
        headerSubtitle=""
      >
        <section className="flex-1 p-8" />
      </WorkspaceLayout>
    );
  }

  return <WorkspaceSettingsContent initialWorkspace={initialWorkspace} />;
}

type WorkspaceSettingsContentProps = {
  initialWorkspace: WorkspaceDetails;
};

function WorkspaceSettingsContent({
  initialWorkspace,
}: WorkspaceSettingsContentProps) {
  const {
    workspace,
    saving,
    deleting,
    error,
    success,
    updateWorkspace,
    deleteWorkspace,
  } = useWorkspaceSettings(initialWorkspace);
  useToastMessage(error, { title: "Erro ao salvar workspace" });
  const [name, setName] = useState(workspace.name);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const canManageWorkspace =
    workspace.userRole === "OWNER" || workspace.userRole === "ADMIN";
  const canDeleteWorkspace =
    workspace.userRole === "OWNER" && deleteConfirmation === workspace.name;
  useToastMessage(
    !canManageWorkspace ? "Você não tem permissão para alterar este workspace." : "",
    { variant: "warning", title: "Permissão" }
  );

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updated = await updateWorkspace(name);

    if (updated) {
      setName(name.trim());
    }
  }

  async function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canDeleteWorkspace) {
      return;
    }

    setIsDeleteModalOpen(true);
  }

  async function confirmDeleteWorkspace() {
    await deleteWorkspace();
  }

  function closeDeleteModal() {
    if (deleting) {
      return;
    }

    setIsDeleteModalOpen(false);
  }

  return (
    <WorkspaceLayout
      workspaceId={workspace.id}
      workspaceRole={workspace.userRole}
      headerTitle={workspace.name}
      headerSubtitle=""
    >
      <section className="flex-1 p-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Configurações
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie as informações e ações administrativas deste workspace.
            </p>
          </div>

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <form
            onSubmit={handleUpdate}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-950">
                Informações do workspace
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Atualize o nome usado para identificar este ambiente.
              </p>
            </div>

            <label
              htmlFor="workspace-name"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Nome do workspace
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="workspace-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={120}
                disabled={!canManageWorkspace || saving || deleting}
                className="min-h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                required
              />

              <button
                type="submit"
                disabled={
                  !canManageWorkspace ||
                  saving ||
                  deleting ||
                  name.trim() === workspace.name
                }
                className="min-h-11 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>

          <form
            onSubmit={handleDelete}
            className="rounded-lg border border-red-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Trash2 size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Excluir workspace
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Esta ação remove o workspace e não pode ser desfeita.
                </p>
              </div>
            </div>

            {workspace.userRole !== "OWNER" ? (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Apenas o owner pode excluir este workspace.
              </p>
            ) : (
              <>
                <label
                  htmlFor="delete-confirmation"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Digite {workspace.name} para confirmar
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="delete-confirmation"
                    type="text"
                    value={deleteConfirmation}
                    onChange={(event) =>
                      setDeleteConfirmation(event.target.value)
                    }
                    disabled={saving || deleting}
                    className="min-h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100 disabled:text-slate-500"
                  />

                  <button
                    type="submit"
                    disabled={!canDeleteWorkspace || saving || deleting}
                    className="min-h-11 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-workspace-title"
          onClick={closeDeleteModal}
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
                    id="delete-workspace-title"
                    className="text-lg font-semibold text-slate-950"
                  >
                    Excluir workspace?
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Essa ação não pode ser desfeita.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>

            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              O workspace {workspace.name} será removido permanentemente.
            </p>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="min-h-11 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDeleteWorkspace}
                disabled={deleting}
                className="min-h-11 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Excluindo..." : "Excluir definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}

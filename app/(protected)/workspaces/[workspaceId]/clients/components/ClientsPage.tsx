"use client";

import { useCallback, useEffect, useState } from "react";
import { BriefcaseBusiness, Plus, X } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useClients } from "../hooks/useClients";
import { ClientCard } from "./ClientCard";
import { ClientDeleteModal } from "./ClientDeleteModal";
import { ClientForm } from "./ClientForm";
import type { WorkspaceDetails } from "../../types/workspaceDetails";
import type { Client } from "../types/client";

type ClientsPageProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetails;
};

export function ClientsPage({ workspaceId, initialWorkspace }: ClientsPageProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const {
    clients,
    form,
    loading,
    saving,
    error,
    updateForm,
    resetForm,
    loadClientForEdit,
    createClient,
    updateClient,
    deleteClient,
  } = useClients(workspaceId);

  const closeCreateModal = useCallback(() => {
    if (saving) {
      return;
    }

    resetForm();
    setIsCreateModalOpen(false);
  }, [resetForm, saving]);

  const closeEditModal = useCallback(() => {
    if (saving) return;
    resetForm();
    setEditingClient(null);
  }, [resetForm, saving]);

  const closeDeleteModal = useCallback(() => {
    if (saving) return;
    setDeletingClient(null);
  }, [saving]);

  function openCreateModal() {
    resetForm();
    setIsCreateModalOpen(true);
  }

  async function openEditModal(client: Client) {
    const freshClient = await loadClientForEdit(client.id);
    if (freshClient) setEditingClient(freshClient);
  }

  async function handleCreateClient() {
    const created = await createClient();

    if (created) {
      setIsCreateModalOpen(false);
    }

    return created;
  }

  async function handleUpdateClient() {
    if (!editingClient) return false;
    const updated = await updateClient(editingClient.id);
    if (updated) setEditingClient(null);
    return updated;
  }

  useEffect(() => {
    if (!isCreateModalOpen && !editingClient && !deletingClient) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isCreateModalOpen) closeCreateModal();
        if (editingClient) closeEditModal();
        if (deletingClient) closeDeleteModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    closeCreateModal,
    closeDeleteModal,
    closeEditModal,
    deletingClient,
    editingClient,
    isCreateModalOpen,
  ]);

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={initialWorkspace.userRole}
      headerTitle={initialWorkspace.name}
      headerSubtitle=""
    >
      <section className="flex-1 p-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-950">Clientes</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Gerencie os clientes deste workspace.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <Plus size={18} />
              Novo cliente
            </button>
          </header>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Carregando clientes...
            </div>
          )}

          {!loading && clients.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <BriefcaseBusiness size={28} />
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Nenhum cliente cadastrado
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Crie o primeiro cliente para vincular contatos ao workspace.
                </p>
              </div>
            </div>
          )}

          {!loading && clients.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  disabled={saving}
                  onEdit={openEditModal}
                  onDelete={setDeletingClient}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-client-title"
          onClick={closeCreateModal}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="create-client-title"
                  className="text-lg font-semibold text-slate-950"
                >
                  Novo cliente
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Cadastre os dados principais do cliente.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={saving}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>

            <ClientForm
              form={form}
              loading={saving}
              onChange={updateForm}
              onSubmit={handleCreateClient}
            />
          </div>
        </div>
      )}

      {editingClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-client-title"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="edit-client-title" className="text-lg font-semibold text-slate-950">
                  Editar cliente
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Atualize os dados principais do cliente.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>
            <ClientForm
              form={form}
              loading={saving}
              onChange={updateForm}
              onSubmit={handleUpdateClient}
              submitLabel="Salvar alterações"
            />
          </div>
        </div>
      )}

      {deletingClient && (
        <ClientDeleteModal
          client={deletingClient}
          loading={saving}
          onClose={closeDeleteModal}
          onConfirm={() => deleteClient(deletingClient.id)}
        />
      )}
    </WorkspaceLayout>
  );
}

"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await createWorkspace(name);

    if (created) {
      setName("");
    }
  }

  return (
    <WorkspaceLayout navVariant="workspaces">
      <section className="w-full px-6 py-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <WorkspaceWelcome totalWorkspaces={workspaces.length} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Seus workspaces
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Todos os ambientes dos quais você faz parte.
                  </p>
                </div>
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

            <aside className="xl:pt-12">
              <WorkspaceCreateForm
                name={name}
                loading={creating}
                onNameChange={setName}
                onSubmit={handleSubmit}
              />
            </aside>
          </div>
        </div>
      </section>
    </WorkspaceLayout>
  );
}

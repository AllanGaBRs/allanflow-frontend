"use client";

import { useState } from "react";
import { WorkspaceLayout } from "./WorkspaceLayout";
import { useWorkspaces } from "../hooks/useWorkspace";
import { WorkspacePanel } from "./WorkspacePanel";
import { WorkspaceCreateForm } from "./WorkspaceCreateForm";
import { WorkspaceCard } from "./WorkspaceCard";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";


export function WorkspaceList() {
  const { workspaces, loading, creating, error, createWorkspace } =
    useWorkspaces();

  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createWorkspace(name);
    setName("");
  }

  return (
    <WorkspaceLayout>
      <WorkspacePanel>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Buscar workspace"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <WorkspaceCreateForm
          name={name}
          loading={creating}
          onNameChange={setName}
          onSubmit={handleSubmit}
        />

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <p className="mb-3 text-xs font-semibold uppercase text-slate-400">
          Seus workspaces
        </p>

        {loading && <p className="text-sm text-slate-500">Carregando...</p>}

        {!loading && workspaces.length === 0 && (
          <p className="text-sm text-slate-500">Nenhum workspace criado.</p>
        )}

        <div className="flex flex-col gap-2">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      </WorkspacePanel>

      <WorkspaceEmptyState />
    </WorkspaceLayout>
  );
}
"use client";

import Link from "next/link";
import { useWorkspaceDetails } from "../hooks/useWorkspaceDetails";

type WorkspaceDetailsProps = {
  workspaceId: string;
};

export function WorkspaceDetails({ workspaceId }: WorkspaceDetailsProps) {
  const { workspace, loading, error } = useWorkspaceDetails(workspaceId);

  return (
    <div className="min-h-screen bg-[#020B1F] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/workspaces"
              className="mb-3 inline-block text-sm text-blue-400 hover:underline"
            >
              Voltar para workspaces
            </Link>

            <h1 className="text-2xl font-bold">
              {loading ? "Carregando..." : workspace?.name}
            </h1>

            <p className="mt-1 text-sm text-white/50">
              Gerencie as tarefas e informações deste workspace
            </p>
          </div>

          <button className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            Nova tarefa
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && workspace && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm text-white/50">Workspace</p>
              <h2 className="mt-2 text-xl font-semibold">{workspace.name}</h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm text-white/50">Sua permissão</p>
              <h2 className="mt-2 text-xl font-semibold">
                {workspace.userRole || "MEMBER"}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm text-white/50">Status</p>
              <h2 className="mt-2 text-xl font-semibold text-green-400">
                Ativo
              </h2>
            </div>
          </div>
        )}

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Tarefas</h2>
              <p className="mt-1 text-sm text-white/50">
                Em breve, aqui ficará o quadro de tarefas do workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {["A fazer", "Em andamento", "Em revisão", "Concluído"].map(
              (column) => (
                <div
                  key={column}
                  className="min-h-56 rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <h3 className="mb-4 text-sm font-semibold text-white/70">
                    {column}
                  </h3>

                  <p className="text-sm text-white/35">
                    Nenhuma tarefa ainda.
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
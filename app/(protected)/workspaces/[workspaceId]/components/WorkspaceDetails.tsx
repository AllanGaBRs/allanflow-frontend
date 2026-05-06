"use client";

import Link from "next/link";
import { useWorkspaceDetails } from "../hooks/useWorkspaceDetails";
import { WorkspaceLayout } from "../../components/WorkspaceLayout";

type WorkspaceDetailsProps = {
  workspaceId: string;
};

export function WorkspaceDetails({ workspaceId }: WorkspaceDetailsProps) {
  const { workspace, loading, error } = useWorkspaceDetails(workspaceId);

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={workspace?.userRole}
    >
      <section className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/workspaces"
              className="mb-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Voltar para workspaces
            </Link>

            <h1 className="text-2xl font-bold text-slate-800">
              {loading ? "Carregando..." : workspace?.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Gerencie tarefas, membros e informações deste workspace
            </p>
          </div>

          <button className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Nova tarefa
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && workspace && (
          <div className="mb-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Workspace</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-800">
                {workspace.name}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Sua permissão</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-800">
                {workspace.userRole || "MEMBER"}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Status</p>
              <h2 className="mt-2 text-xl font-semibold text-green-600">
                Ativo
              </h2>
            </div>
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">Tarefas</h2>
            <p className="mt-1 text-sm text-slate-500">
              Em breve, aqui ficará o quadro de tarefas do workspace.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {["A fazer", "Em andamento", "Em revisão", "Concluído"].map(
              (column) => (
                <div
                  key={column}
                  className="min-h-56 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="mb-4 text-sm font-semibold text-slate-600">
                    {column}
                  </h3>

                  <p className="text-sm text-slate-400">
                    Nenhuma tarefa ainda.
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      </section>
    </WorkspaceLayout>
  );
}

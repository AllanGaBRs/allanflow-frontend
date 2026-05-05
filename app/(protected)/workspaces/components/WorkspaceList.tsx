"use client";

import Link from "next/link";
import { useState } from "react";
import { useWorkspaces } from "../hooks/useWorkspace";

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
    <div className="min-h-screen bg-[#020B1F] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <p className="mt-1 text-sm text-white/50">
            Gerencie seus ambientes de trabalho
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[360px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
          >
            <h2 className="mb-4 text-lg font-semibold">Criar workspace</h2>

            <div className="mb-4">
              <label className="mb-2 block text-sm text-white/70">
                Nome
              </label>

              <input
                type="text"
                placeholder="Ex: Projeto pessoal"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={120}
              />
            </div>

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? "Criando..." : "Criar workspace"}
            </button>
          </form>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-4 text-lg font-semibold">Seus workspaces</h2>

            {loading && (
              <p className="text-sm text-white/50">
                Carregando workspaces...
              </p>
            )}

            {!loading && workspaces.length === 0 && (
              <p className="text-sm text-white/50">
                Nenhum workspace criado ainda.
              </p>
            )}

            <div className="grid gap-4">
              {workspaces.map((workspace) => (
                <Link
                  key={workspace.id}
                  href={`/workspaces/${workspace.id}`}
                  className="rounded-xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-blue-500/60 hover:bg-white/[0.08]"
                >
                  <h3 className="font-semibold text-white">
                    {workspace.name}
                  </h3>

                  <p className="mt-4 text-sm text-blue-400">
                    Entrar no workspace
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
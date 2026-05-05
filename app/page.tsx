import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020B1F] text-white flex flex-col">

      <header className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <h1 className="text-lg font-semibold">Task Manager</h1>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-sm text-white/70 hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            Organize seus projetos de forma simples e eficiente
          </h2>

          <p className="mt-6 text-white/60 text-lg">
            Um sistema completo para gerenciar tarefas, workspaces e equipes.
            Tudo em um só lugar, com foco em produtividade e clareza.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
            >
              Começar agora
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white/80 hover:bg-white/10 transition"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-3">
          
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold mb-2">Workspaces</h3>
            <p className="text-sm text-white/60">
              Separe seus projetos por ambientes e mantenha tudo organizado.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold mb-2">Tarefas</h3>
            <p className="text-sm text-white/60">
              Crie, edite e acompanhe tarefas de forma simples e rápida.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold mb-2">Multi-tenant</h3>
            <p className="text-sm text-white/60">
              Sistema preparado para múltiplos usuários e organizações.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
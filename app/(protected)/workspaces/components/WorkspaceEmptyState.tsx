export function WorkspaceEmptyState() {
  return (
    <section className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-4xl">
          📁
        </div>

        <h2 className="text-2xl font-bold text-slate-800">
          Escolha um workspace
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Selecione um workspace na lateral para visualizar tarefas, membros e
          configurações do ambiente.
        </p>
      </div>
    </section>
  );
}
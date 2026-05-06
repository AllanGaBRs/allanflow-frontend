import { FolderPlus } from "lucide-react";

export function WorkspaceEmptyState() {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FolderPlus size={28} />
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          Nenhum workspace ainda
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Crie seu primeiro workspace para organizar tarefas, membros e rotinas
          do time em um só lugar.
        </p>
      </div>
    </section>
  );
}

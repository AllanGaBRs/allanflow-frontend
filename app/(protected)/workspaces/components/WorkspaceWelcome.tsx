import Image from "next/image";
import { LayoutDashboard } from "lucide-react";

type WorkspaceWelcomeProps = {
  totalWorkspaces: number;
};

export function WorkspaceWelcome({ totalWorkspaces }: WorkspaceWelcomeProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <Image
              src="/img/AllanFlow.png"
              alt="AllanFlow"
              width={379}
              height={412}
              className="h-auto w-12 object-contain"
              priority
            />
          </div>

          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
              <LayoutDashboard size={16} />
              AllanFlow
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Escolha um workspace para continuar o trabalho ou crie um novo
              ambiente para organizar tarefas e equipes.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-[#F5F7FB] px-5 py-4">
          <p className="text-sm font-medium text-slate-500">Workspaces</p>
          <p className="mt-1 text-3xl font-bold text-slate-950">
            {totalWorkspaces}
          </p>
        </div>
      </div>
    </section>
  );
}

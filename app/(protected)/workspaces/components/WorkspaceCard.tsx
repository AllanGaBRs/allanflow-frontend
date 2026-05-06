import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { Workspace } from "../types/workspace";

type Props = {
  workspace: Workspace;
};

export function WorkspaceCard({ workspace }: Props) {
  const role = workspace.userRole ?? "MEMBER";
  const initial = workspace.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <Link
      href={`/workspaces/${workspace.id}`}
      className="group flex min-h-36 flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-base font-bold text-blue-700">
          {initial}
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
          <ShieldCheck size={14} />
          {role}
        </span>
      </div>

      <div>
        <h3 className="truncate text-base font-semibold text-slate-900">
          {workspace.name}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-600">
          Abrir workspace
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-0.5"
          />
        </p>
      </div>
    </Link>
  );
}

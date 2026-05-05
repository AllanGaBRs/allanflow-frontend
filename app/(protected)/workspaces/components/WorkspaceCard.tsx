import Link from "next/link";
import type { Workspace } from "../types/workspace";

type Props = {
  workspace: Workspace;
};

export function WorkspaceCard({ workspace }: Props) {
  return (
    <Link
      href={`/workspaces/${workspace.id}`}
      className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-blue-400 hover:bg-blue-50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
        {workspace.name.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">
          {workspace.name}
        </p>
        <p className="text-xs text-slate-400">Entrar no workspace</p>
      </div>
    </Link>
  );
}
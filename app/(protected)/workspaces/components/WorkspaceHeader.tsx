"use client";

import { useUser } from "../../hooks/useUser";
import { UserMenu } from "./UserMenu";

type WorkspaceHeaderProps = {
  title?: string;
  subtitle?: string;
};

export function WorkspaceHeader({
  title = "Dashboard",
  subtitle = "Selecione um workspace para começar",
}: WorkspaceHeaderProps) {
  const { user, loading } = useUser();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {loading ? (
        <div className="h-9 w-9 rounded-full bg-slate-200" />
      ) : (
        <UserMenu name={user?.name} email={user?.email || "?"} />
      )}
    </header>
  );
}

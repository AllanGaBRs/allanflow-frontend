"use client";

import { useUser } from "../../hooks/useUser";
import { UserMenu } from "./UserMenu";

export function WorkspaceHeader() {
  const { user, loading } = useUser();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-xs text-slate-500">
          Selecione um workspace para começar
        </p>
      </div>

      {loading ? (
        <div className="h-9 w-9 rounded-full bg-slate-200" />
      ) : (
        <UserMenu email={user?.email || "?"} />
      )}
    </header>
  );
}
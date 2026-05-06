"use client";

import { ReactNode, useState } from "react";
import { NavBar } from "../../components/NavBar";
import { WorkspaceHeader } from "./WorkspaceHeader";

type Props = {
  children: ReactNode;
  navVariant?: "default" | "workspaces";
  workspaceId?: string;
  workspaceRole?: "OWNER" | "ADMIN" | "MEMBER";
};

export function WorkspaceLayout({
  children,
  navVariant = "default",
  workspaceId,
  workspaceRole,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <NavBar
        collapsed={collapsed}
        variant={navVariant}
        workspaceId={workspaceId}
        workspaceRole={workspaceRole}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      <main
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          collapsed ? "pl-20" : "pl-64"
        }`}
      >
        <WorkspaceHeader />

        <div className="flex flex-1">{children}</div>
      </main>
    </div>
  );
}

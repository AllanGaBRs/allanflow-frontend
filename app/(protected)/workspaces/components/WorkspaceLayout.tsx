"use client";

import { ReactNode, useState } from "react";
import { AIAssistant } from "../../components/AIAssistant";
import { NavBar } from "../../components/NavBar";
import { WorkspaceHeader } from "./WorkspaceHeader";

type Props = {
  children: ReactNode;
  navVariant?: "default" | "workspaces";
  workspaceId?: string;
  workspaceRole?: "OWNER" | "ADMIN" | "MEMBER";
  headerTitle?: string;
  headerSubtitle?: string;
};

export function WorkspaceLayout({
  children,
  navVariant = "default",
  workspaceId,
  workspaceRole,
  headerTitle,
  headerSubtitle,
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
        className={`flex min-h-screen min-w-0 flex-col overflow-x-hidden transition-all duration-300 ${
          collapsed ? "pl-20" : "pl-64"
        }`}
      >
        <WorkspaceHeader title={headerTitle} subtitle={headerSubtitle} />

        <div className="flex min-w-0 flex-1 overflow-x-hidden">{children}</div>
      </main>

      <AIAssistant />
    </div>
  );
}

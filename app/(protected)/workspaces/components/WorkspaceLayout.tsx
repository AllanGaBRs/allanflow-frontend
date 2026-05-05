import { ReactNode } from "react";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceHeader } from "./WorkspaceHeader";


type Props = {
  children: ReactNode;
};

export function WorkspaceLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-[#F5F7FB] text-slate-900">
      <WorkspaceSidebar />

      <main className="ml-64 flex min-h-screen flex-1 flex-col">
        <WorkspaceHeader />

        <div className="flex flex-1">{children}</div>
      </main>
    </div>
  );
}
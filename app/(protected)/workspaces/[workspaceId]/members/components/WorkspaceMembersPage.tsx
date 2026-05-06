"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useWorkspaceDetails } from "../../hooks/useWorkspaceDetails";
import { MembersSection } from "./MembersSection";

type WorkspaceMembersPageProps = {
  workspaceId: string;
};

export function WorkspaceMembersPage({ workspaceId }: WorkspaceMembersPageProps) {
  const { workspace, loading, error } = useWorkspaceDetails(workspaceId);

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={workspace?.userRole}
    >
      <section className="flex-1 p-8">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href={`/workspaces/${workspaceId}`}
              className="mb-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Voltar para o workspace
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Users size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Membros
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {loading
                    ? "Carregando workspace..."
                    : `Gerencie os membros de ${workspace?.name ?? "workspace"}.`}
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <MembersSection workspaceId={workspaceId} />
      </section>
    </WorkspaceLayout>
  );
}

"use client";

import { LayoutDashboard } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import type { WorkspaceDetails } from "../../types/workspaceDetails";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardLoading } from "./DashboardLoading";
import { DashboardSummaryCards } from "./DashboardSummaryCards";
import { TasksByPriorityCard } from "./TasksByPriorityCard";
import { useToastMessage } from "@/components/notifications/useToastMessage";

type WorkspaceDashboardPageProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetails;
  initialError: string;
};

export function WorkspaceDashboardPage({
  workspaceId,
  initialWorkspace,
  initialError,
}: WorkspaceDashboardPageProps) {
  const { dashboard, loading, error, loadDashboard } =
    useDashboard(workspaceId);
  const pageError = initialError || error;
  useToastMessage(pageError, { title: "Erro no dashboard" });

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={initialWorkspace.userRole}
      headerTitle={initialWorkspace.name}
      headerSubtitle=""
    >
      <section className="flex-1 p-6 lg:p-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <header className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <LayoutDashboard size={22} aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
              <p className="mt-1 text-sm text-slate-500">
                Acompanhe os principais indicadores do workspace.
              </p>
            </div>
          </header>

          {pageError && !initialError && (
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              Tentar novamente
            </button>
          )}

          {loading && <DashboardLoading />}

          {!loading && dashboard && (
            <>
              <DashboardSummaryCards summary={dashboard.summary} />
              <TasksByPriorityCard
                tasksByPriority={dashboard.tasksByPriority}
              />
            </>
          )}
        </div>
      </section>
    </WorkspaceLayout>
  );
}

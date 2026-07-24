"use client";

import { AlertCircle, LayoutDashboard } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import type { WorkspaceDetails } from "../../types/workspaceDetails";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardLoading } from "./DashboardLoading";
import { DashboardSummaryCards } from "./DashboardSummaryCards";
import { TasksByPriorityCard } from "./TasksByPriorityCard";

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

          {pageError && (
            <div
              className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={18} aria-hidden="true" />
                <span>{pageError}</span>
              </div>

              {!initialError && (
                <button
                  type="button"
                  onClick={() => void loadDashboard()}
                  className="font-semibold text-red-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  Tentar novamente
                </button>
              )}
            </div>
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

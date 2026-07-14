"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useBoards } from "../hooks/useBoards";
import { useColumns } from "../hooks/useColumns";
import { useTasksByColumn } from "../hooks/useTasksByColumn";
import { BoardColumnsView } from "./BoardColumnsView";
import { BoardsEmptyState } from "./BoardsEmptyState";
import { BoardsToolbar } from "./BoardsToolbar";
import type { WorkspaceDetails } from "../../types/workspaceDetails";

type BoardsPageProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetails;
};

export function BoardsPage({ workspaceId, initialWorkspace }: BoardsPageProps) {
  const { boards, loading, error } = useBoards(workspaceId);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const canManageBoards =
    initialWorkspace.userRole === "OWNER" || initialWorkspace.userRole === "ADMIN";
  const selectedBoard = useMemo(
    () => boards.find((board) => board.id === selectedBoardId) ?? boards[0],
    [boards, selectedBoardId]
  );
  const {
    columns,
    loading: loadingColumns,
    error: columnsError,
  } = useColumns(workspaceId, selectedBoard?.id, {
    initialColumns: selectedBoard?.columns,
  });
  const {
    tasksByColumn,
    loading: loadingTasks,
    error: tasksError,
  } = useTasksByColumn(workspaceId, selectedBoard?.id, columns);

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={initialWorkspace.userRole}
      headerTitle={initialWorkspace.name}
      headerSubtitle=""
    >
      <section className="min-w-0 flex-1 overflow-hidden px-6 py-6 lg:px-8">
        <div className="flex h-full min-h-[calc(100vh-7rem)] min-w-0 max-w-full flex-col gap-5 overflow-hidden">
          <BoardsToolbar
            workspaceId={workspaceId}
            boards={boards}
            selectedBoardId={selectedBoard?.id ?? ""}
            loading={loading}
            canManageBoards={canManageBoards}
            onSelectBoard={setSelectedBoardId}
          />

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {columnsError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} />
              {columnsError}
            </div>
          )}

          {tasksError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} />
              {tasksError}
            </div>
          )}

          {loading && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Carregando boards...
            </div>
          )}

          {!loading && !selectedBoard && (
            <BoardsEmptyState
              title="Nenhum board disponível"
              description="Quando houver boards neste workspace, eles aparecerão aqui para seleção."
            />
          )}

          {!loading && selectedBoard && (
            <BoardColumnsView
              board={selectedBoard}
              columns={columns}
              loading={loadingColumns}
              tasksByColumn={tasksByColumn}
              tasksLoading={loadingTasks}
            />
          )}
        </div>
      </section>

    </WorkspaceLayout>
  );
}

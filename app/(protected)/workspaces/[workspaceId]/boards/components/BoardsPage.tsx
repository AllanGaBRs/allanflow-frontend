"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useClients } from "../../clients/hooks/useClients";
import { useMembers } from "../../members/hooks/useMembers";
import { useBoards } from "../hooks/useBoards";
import { useColumns } from "../hooks/useColumns";
import { useLabels } from "../hooks/useLabels";
import { useTasksByColumn } from "../hooks/useTasksByColumn";
import { BoardColumnsView } from "./BoardColumnsView";
import { BoardsEmptyState } from "./BoardsEmptyState";
import { BoardsToolbar } from "./BoardsToolbar";
import { TaskDetailsModal } from "./TaskDetailsModal";
import { TaskDeleteModal } from "./TaskDeleteModal";
import type { WorkspaceDetails } from "../../types/workspaceDetails";

type BoardsPageProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetails;
};

export function BoardsPage({ workspaceId, initialWorkspace }: BoardsPageProps) {
  const { boards, loading, error } = useBoards(workspaceId);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
    labels,
    loading: loadingLabels,
    error: labelsError,
  } = useLabels(workspaceId, selectedBoard?.id);
  const {
    clients,
    loading: loadingClients,
    error: clientsError,
  } = useClients(workspaceId);
  const {
    members,
    loading: loadingMembers,
    error: membersError,
  } = useMembers(workspaceId);
  const {
    tasksByColumn,
    loading: loadingTasks,
    error: tasksError,
    moving: movingTask,
    loadingTaskDetails,
    savingTask,
    deletingTask,
    selectedTask,
    createColumnId,
    taskForm,
    moveTask,
    openTaskDetails,
    openTaskCreate,
    closeTaskDetails,
    closeTaskCreate,
    updateTaskForm,
    updateSelectedTask,
    deleteSelectedTask,
    createTask,
  } = useTasksByColumn(workspaceId, selectedBoard?.id, columns);
  const taskDetailsLoading =
    loadingTaskDetails || loadingLabels || loadingClients || loadingMembers;
  const taskDetailsError =
    tasksError || labelsError || clientsError || membersError;

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

          {(labelsError || clientsError || membersError) && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} />
              {labelsError || clientsError || membersError}
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
              movingTask={movingTask}
              onMoveTask={moveTask}
              onOpenTask={(task) => void openTaskDetails(task)}
              onCreateTask={openTaskCreate}
            />
          )}
        </div>
      </section>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          columnName={selectedTask.columnName}
          form={taskForm}
          labels={labels}
          clients={clients}
          members={members}
          loading={taskDetailsLoading}
          saving={savingTask}
          deleting={deletingTask}
          error={taskDetailsError}
          onClose={closeTaskDetails}
          onChange={updateTaskForm}
          onSubmit={updateSelectedTask}
          onDeleteRequest={() => setDeleteModalOpen(true)}
        />
      )}

      {selectedTask && deleteModalOpen && (
        <TaskDeleteModal
          task={selectedTask}
          loading={deletingTask}
          error={tasksError}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={deleteSelectedTask}
        />
      )}

      {createColumnId && (
        <TaskDetailsModal
          columnName={
            columns.find((column) => column.id === createColumnId)?.name ??
            "Coluna"
          }
          mode="create"
          form={taskForm}
          labels={labels}
          clients={clients}
          members={members}
          loading={taskDetailsLoading}
          saving={savingTask}
          error={taskDetailsError}
          onClose={closeTaskCreate}
          onChange={updateTaskForm}
          onSubmit={createTask}
        />
      )}
    </WorkspaceLayout>
  );
}

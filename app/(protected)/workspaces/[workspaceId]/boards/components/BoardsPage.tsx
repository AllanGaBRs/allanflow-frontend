"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useUser } from "../../../../hooks/useUser";
import { useClients } from "../../clients/hooks/useClients";
import { useMembers } from "../../members/hooks/useMembers";
import { useBoardMembers } from "../hooks/useBoardMembers";
import { useBoards } from "../hooks/useBoards";
import { useColumns } from "../hooks/useColumns";
import { useLabels } from "../hooks/useLabels";
import { useTasksByColumn } from "../hooks/useTasksByColumn";
import { BoardHeader } from "./BoardHeader";
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
  const { user } = useUser();
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
    boardMembers,
    loadingBoardMembers,
    boardMembersError,
  } = useBoardMembers(workspaceId, selectedBoard?.id);
  const taskAssigneeOptions = useMemo(() => {
    const workspaceManagers = members.filter(
      (member) => member.role === "OWNER" || member.role === "ADMIN"
    );
    const workspaceMemberById = new Map(
      members.map((member) => [member.userId, member])
    );
    const explicitBoardMembers = boardMembers.map((member) => {
      const workspaceMember = workspaceMemberById.get(member.userId);

      return {
        userId: member.userId,
        userName: member.name,
        userEmail: member.email,
        role: workspaceMember?.role ?? "MEMBER",
      };
    });
    const assigneeById = new Map(
      [...workspaceManagers, ...explicitBoardMembers].map((member) => [
        member.userId,
        member,
      ])
    );

    return Array.from(assigneeById.values());
  }, [members, boardMembers]);
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
    loadingTaskDetails ||
    loadingLabels ||
    loadingClients ||
    loadingMembers ||
    loadingBoardMembers;
  const taskDetailsError =
    tasksError || labelsError || clientsError || membersError || boardMembersError;
  const loadingBoardData = loading || loadingColumns || loadingTasks;
  const boardPageError =
    error ||
    columnsError ||
    tasksError ||
    labelsError ||
    clientsError ||
    membersError ||
    boardMembersError;

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={initialWorkspace.userRole}
      headerTitle={initialWorkspace.name}
      headerSubtitle=""
    >
      <section className="h-[calc(100dvh-4rem)] min-h-0 min-w-0 flex-1 overflow-hidden px-6 py-6 lg:px-8">
        <div className="flex h-full min-h-0 min-w-0 max-w-full flex-col gap-5 overflow-hidden">
          {selectedBoard && (
            <div className="flex min-w-0 flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
              <BoardHeader board={selectedBoard} />
              <BoardsToolbar
                workspaceId={workspaceId}
                boards={boards}
                selectedBoardId={selectedBoard.id}
                loading={loading}
                canManageBoards={canManageBoards}
                onSelectBoard={setSelectedBoardId}
              />
            </div>
          )}

          {!loadingBoardData && boardPageError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} />
              {boardPageError}
            </div>
          )}

          {loadingBoardData && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Carregando board...
            </div>
          )}

          {!loadingBoardData && !selectedBoard && (
            <BoardsEmptyState
              title="Nenhum board disponível"
              description="Quando houver boards neste workspace, eles aparecerão aqui para seleção."
            />
          )}

          {!loadingBoardData && selectedBoard && (
            <BoardColumnsView
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
          workspaceId={workspaceId}
          columnName={selectedTask.columnName}
          form={taskForm}
          labels={labels}
          clients={clients}
          members={taskAssigneeOptions}
          currentUserId={user?.id}
          canManageComments={canManageBoards}
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
          workspaceId={workspaceId}
          columnName={
            columns.find((column) => column.id === createColumnId)?.name ??
            "Coluna"
          }
          mode="create"
          form={taskForm}
          labels={labels}
          clients={clients}
          members={taskAssigneeOptions}
          currentUserId={user?.id}
          canManageComments={canManageBoards}
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

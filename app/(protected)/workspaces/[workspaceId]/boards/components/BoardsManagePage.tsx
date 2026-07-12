"use client";

import { useState } from "react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useBoards } from "../hooks/useBoards";
import { BoardEditModal } from "./BoardEditModal";
import { BoardFormModal } from "./BoardFormModal";
import { BoardsManageContent } from "./BoardsManageContent";
import { BoardsManageHeader } from "./BoardsManageHeader";
import type { Board } from "../types/board";
import type { WorkspaceDetails } from "../../types/workspaceDetails";

type BoardsManagePageProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetails;
};

export function BoardsManagePage({
  workspaceId,
  initialWorkspace,
}: BoardsManagePageProps) {
  const {
    boards,
    loading,
    saving,
    error,
    createBoard,
    updateBoard,
  } = useBoards(workspaceId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={initialWorkspace.userRole}
      headerTitle={initialWorkspace.name}
      headerSubtitle=""
    >
      <section className="flex-1 p-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <BoardsManageHeader
            onCreateBoard={() => setIsCreateModalOpen(true)}
          />

          <BoardsManageContent
            boards={boards}
            loading={loading}
            saving={saving}
            error={error}
            onManageBoard={setEditingBoard}
          />
        </div>
      </section>

      {isCreateModalOpen && (
        <BoardFormModal
          title="Novo board"
          description="Crie um quadro para organizar as tarefas."
          submitLabel="Criar"
          loading={saving}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={createBoard}
        />
      )}

      {editingBoard && (
        <BoardEditModal
          workspaceId={workspaceId}
          board={editingBoard}
          loading={saving}
          onClose={() => setEditingBoard(null)}
          onUpdateBoard={(payload) => updateBoard(editingBoard.id, payload)}
        />
      )}

    </WorkspaceLayout>
  );
}

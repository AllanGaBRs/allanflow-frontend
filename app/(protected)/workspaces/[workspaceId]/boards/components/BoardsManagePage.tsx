"use client";

import { useState } from "react";
import { AlertCircle, Kanban, Plus } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useBoards } from "../hooks/useBoards";
import { BoardCard } from "./BoardCard";
import { BoardEditModal } from "./BoardEditModal";
import { BoardFormModal } from "./BoardFormModal";
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Kanban size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-950">
                  Gerenciar boards
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Crie, edite e organize os boards deste workspace.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <Plus size={18} />
              Novo board
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Carregando boards...
            </div>
          )}

          {!loading && boards.length === 0 && (
            <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Kanban size={28} />
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Nenhum board ainda
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Crie o primeiro board para começar a organizar tarefas deste
                  workspace.
                </p>
              </div>
            </section>
          )}

          {!loading && boards.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {boards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  loading={saving}
                  onManage={setEditingBoard}
                />
              ))}
            </div>
          )}
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

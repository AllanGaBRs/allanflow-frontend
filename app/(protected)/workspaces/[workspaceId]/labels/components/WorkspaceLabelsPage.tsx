"use client";

import { useState } from "react";
import { Tags } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { LabelsManageSection } from "../../boards/components/LabelsManageSection";
import { useBoards } from "../../boards/hooks/useBoards";
import type { WorkspaceDetails } from "../../types/workspaceDetails";

type WorkspaceLabelsPageProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetails | null;
  initialError: string;
};

export function WorkspaceLabelsPage({
  workspaceId,
  initialWorkspace,
  initialError,
}: WorkspaceLabelsPageProps) {
  const { boards, loading, error } = useBoards(workspaceId);
  const [selectedBoardIdState, setSelectedBoardIdState] = useState("");
  const selectedBoardId = selectedBoardIdState || boards[0]?.id || "";

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={initialWorkspace?.userRole}
      headerTitle={initialWorkspace?.name ?? "Workspace"}
      headerSubtitle=""
    >
      <section className="flex-1 p-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Tags size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800">Labels</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Gerencie as labels por board.
                </p>
              </div>
            </div>
          </header>

          {initialError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {initialError}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <label
              htmlFor="labels-board"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Board
            </label>

            <select
              id="labels-board"
              value={selectedBoardId}
              disabled={loading || boards.length === 0}
              className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
              onChange={(event) => setSelectedBoardIdState(event.target.value)}
            >
              {boards.length === 0 ? (
                <option value="">Nenhum board cadastrado</option>
              ) : (
                boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {loading && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Carregando boards...
            </div>
          )}

          {!loading && boards.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Crie um board antes de cadastrar labels.
            </div>
          )}

          {!loading && selectedBoardId && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <LabelsManageSection
                workspaceId={workspaceId}
                boardId={selectedBoardId}
              />
            </div>
          )}
        </div>
      </section>
    </WorkspaceLayout>
  );
}

"use client";

import { useRef, useState } from "react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import { useBoards } from "../../boards/hooks/useBoards";
import type { WorkspaceDetails } from "../../types/workspaceDetails";
import { DocumentsPanel, type DocumentsSaveHandle } from "./DocumentsPanel";

type WorkspaceDocumentsPageProps = {
  workspaceId: string;
  initialWorkspace: WorkspaceDetails | null;
  initialError: string;
};

export function WorkspaceDocumentsPage({
  workspaceId,
  initialWorkspace,
  initialError,
}: WorkspaceDocumentsPageProps) {
  const documentsRef = useRef<DocumentsSaveHandle>(null);
  const switchingRef = useRef(false);
  const [switchingBoard, setSwitchingBoard] = useState(false);
  const { boards, loading, error } = useBoards(workspaceId);
  const [selectedBoardIdState, setSelectedBoardIdState] = useState("");
  const selectedBoardId = selectedBoardIdState || boards[0]?.id || "";

  async function changeBoard(boardId: string) {
    if (switchingRef.current) return;
    switchingRef.current = true;
    setSwitchingBoard(true);
    try {
      if (documentsRef.current && !await documentsRef.current.flush()) return;
      setSelectedBoardIdState(boardId);
    } finally {
      switchingRef.current = false;
      setSwitchingBoard(false);
    }
  }

  useToastMessage(initialError, { title: "Workspace" });
  useToastMessage(error, { title: "Erro ao buscar boards" });

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={initialWorkspace?.userRole}
      headerTitle={initialWorkspace?.name ?? "Workspace"}
      headerSubtitle=""
    >
      <section className="h-[calc(100dvh-4rem)] min-h-0 min-w-0 flex-1 overflow-hidden px-6 py-6 lg:px-8">
        <div className="flex h-full min-h-0 min-w-0 max-w-full flex-col gap-5 overflow-hidden">
          {loading && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Carregando boards...
            </div>
          )}

          {!loading && boards.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Crie um board antes de cadastrar documentos.
            </div>
          )}

          {!loading && selectedBoardId && (
            <DocumentsPanel
              key={`${workspaceId}:${selectedBoardId}`}
              ref={documentsRef}
              switchingBoard={switchingBoard}
              workspaceId={workspaceId}
              boardId={selectedBoardId}
              boardSelector={
                <div>
                  <label
                    htmlFor="documents-board"
                    className="mb-1 block text-xs font-semibold text-slate-500"
                  >
                    Board
                  </label>

                  <select
                    id="documents-board"
                    value={selectedBoardId}
                    disabled={loading || switchingBoard || boards.length === 0}
                    className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                    onChange={(event) =>
                      void changeBoard(event.target.value)
                    }
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
              }
            />
          )}
        </div>
      </section>
    </WorkspaceLayout>
  );
}

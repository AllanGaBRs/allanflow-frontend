"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Kanban, Settings2 } from "lucide-react";
import { WorkspaceLayout } from "../../../components/WorkspaceLayout";
import { useBoards } from "../hooks/useBoards";
import { useColumns } from "../hooks/useColumns";
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

  useEffect(() => {
    if (!selectedBoardId && boards.length > 0) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  return (
    <WorkspaceLayout
      workspaceId={workspaceId}
      workspaceRole={initialWorkspace.userRole}
      headerTitle={initialWorkspace.name}
      headerSubtitle=""
    >
      <section className="min-w-0 flex-1 overflow-hidden px-6 py-6 lg:px-8">
        <div className="flex h-full min-h-[calc(100vh-7rem)] min-w-0 max-w-full flex-col gap-5 overflow-hidden">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Kanban size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-950">Boards</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Visualize e alterne entre os boards disponíveis.
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="board-filter">
                Selecionar board
              </label>
              <select
                id="board-filter"
                value={selectedBoard?.id ?? ""}
                onChange={(event) => setSelectedBoardId(event.target.value)}
                disabled={loading || boards.length === 0}
                className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:w-64"
              >
                {boards.length === 0 ? (
                  <option value="">Nenhum board disponível</option>
                ) : (
                  boards.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))
                )}
              </select>

              {canManageBoards && (
                <Link
                  href={`/workspaces/${workspaceId}/boards/manage`}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <Settings2 size={18} />
                  Gerenciar boards
                </Link>
              )}
            </div>
          </div>

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

          {loading && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Carregando boards...
            </div>
          )}

          {!loading && !selectedBoard && (
            <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Kanban size={28} />
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Nenhum board disponível
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Quando houver boards neste workspace, eles aparecerão aqui
                  para seleção.
                </p>
              </div>
            </section>
          )}

          {!loading && selectedBoard && (
            <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <div className="mb-4 border-b border-slate-200 pb-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-slate-950">
                    {selectedBoard.name}
                  </h2>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                    {selectedBoard.description || "Board selecionado"}
                  </p>
                </div>
              </div>

              {loadingColumns && (
                <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                  Carregando colunas...
                </div>
              )}

              {!loadingColumns && columns.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Kanban size={28} />
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900">
                      Nenhuma coluna ainda
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Crie a primeira coluna para começar a estruturar este
                      board.
                    </p>
                  </div>
                </div>
              )}

              {!loadingColumns && columns.length > 0 && (
                <div className="min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden pb-3">
                  <div className="flex min-h-full w-max gap-4 pr-4">
                    {columns.map((column) => (
                      <article
                        key={column.id}
                        className="flex min-h-[calc(100vh-15rem)] w-[320px] shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {column.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            Posição {column.position}
                          </p>
                        </div>

                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
                          Nenhuma tarefa nesta coluna
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </section>

    </WorkspaceLayout>
  );
}

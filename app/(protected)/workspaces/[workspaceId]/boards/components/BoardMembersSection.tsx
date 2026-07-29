"use client";

import { useMemo, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import type { Member } from "../../members/types/member";
import type { BoardMember } from "../types/boardMember";

type BoardMembersSectionProps = {
  workspaceMembers: Member[];
  boardMembers: BoardMember[];
  loading: boolean;
  saving: boolean;
  error: string;
  onAddMember: (userId: string) => Promise<boolean>;
  onRemoveMember: (userId: string) => Promise<boolean>;
};

export function BoardMembersSection({
  workspaceMembers,
  boardMembers,
  loading,
  saving,
  error,
  onAddMember,
  onRemoveMember,
}: BoardMembersSectionProps) {
  const [selectedUserId, setSelectedUserId] = useState("");
  useToastMessage(error, { title: "Erro ao gerenciar membros do board" });
  const workspaceMemberRoleById = useMemo(
    () =>
      new Map(
        workspaceMembers.map((member) => [member.userId, member.role])
      ),
    [workspaceMembers]
  );
  const manageableBoardMembers = useMemo(
    () =>
      boardMembers.filter(
        (member) => workspaceMemberRoleById.get(member.userId) === "MEMBER"
      ),
    [boardMembers, workspaceMemberRoleById]
  );
  const availableMembers = useMemo(() => {
    const boardMemberIds = new Set(
      boardMembers.map((member) => member.userId)
    );

    return workspaceMembers.filter(
      (member) =>
        member.role === "MEMBER" && !boardMemberIds.has(member.userId)
    );
  }, [workspaceMembers, boardMembers]);
  const busy = loading || saving;

  async function handleAddMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedUserId) {
      return;
    }

    const added = await onAddMember(selectedUserId);

    if (added) {
      setSelectedUserId("");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Membros do board
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Controle quem pode acessar este board.
          </p>
        </div>

        <form
          onSubmit={handleAddMember}
          className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-80 sm:flex-row"
        >
          <select
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
            disabled={busy || availableMembers.length === 0}
            className="min-h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 sm:flex-1"
          >
            <option value="">
              {availableMembers.length === 0
                ? "Todos já estão no board"
                : "Selecionar membro"}
            </option>
            {availableMembers.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.userName}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={busy || !selectedUserId}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={16} />
            Adicionar
          </button>
        </form>
      </div>

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Carregando membros do board...
        </div>
      )}

      {!loading && manageableBoardMembers.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Nenhum membro vinculado a este board.
        </div>
      )}

      {!loading && manageableBoardMembers.length > 0 && (
        <div className="grid gap-2">
          {manageableBoardMembers.map((member) => (
            <div
              key={member.userId}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {member.name}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {member.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void onRemoveMember(member.userId)}
                disabled={saving}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={15} />
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

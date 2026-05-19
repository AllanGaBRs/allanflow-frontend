"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useMembers } from "../hooks/useMembers";
import { AddMemberForm } from "./AddMemberForm";
import { MemberCard } from "./MemberCard";
import type { MembershipRole } from "../types/member";

type Props = {
  workspaceId: string;
};

export function MembersSection({ workspaceId }: Props) {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const {
    members,
    loading,
    saving,
    error,
    addMember,
    updateRole,
    removeMember,
  } = useMembers(workspaceId);

  const closeAddMemberModal = useCallback(() => {
    if (saving) {
      return;
    }

    setIsAddMemberModalOpen(false);
  }, [saving]);

  async function handleAddMember(email: string, role: MembershipRole) {
    const created = await addMember(email, role);

    if (created) {
      setIsAddMemberModalOpen(false);
    }

    return created;
  }

  useEffect(() => {
    if (!isAddMemberModalOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAddMemberModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeAddMemberModal, isAddMemberModalOpen]);

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Membros</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie os usuários que têm acesso a este workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddMemberModalOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <Plus size={18} />
          Add membro
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading && <p className="text-sm text-slate-500">Carregando membros...</p>}

      {!loading && members.length === 0 && (
        <p className="text-sm text-slate-500">Nenhum membro encontrado.</p>
      )}

      <div className="flex flex-col gap-3">
        {members.map((member) => (
          <MemberCard
            key={member.userId}
            member={member}
            loading={saving}
            onUpdateRole={updateRole}
            onRemove={removeMember}
          />
        ))}
      </div>

      {isAddMemberModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-member-title"
          onClick={closeAddMemberModal}
        >
          <div
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="add-member-title"
                  className="text-lg font-semibold text-slate-950"
                >
                  Add membro
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Envie um convite para acessar este workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddMemberModal}
                disabled={saving}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>

            <AddMemberForm loading={saving} onSubmit={handleAddMember} />
          </div>
        </div>
      )}
    </section>
  );
}

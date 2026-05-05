"use client";

import { useMembers } from "../hooks/useMembers";
import { AddMemberForm } from "./AddMemberForm";
import { MemberCard } from "./MemberCard";

type Props = {
  workspaceId: string;
};

export function MembersSection({ workspaceId }: Props) {
  const {
    members,
    loading,
    saving,
    error,
    addMember,
    updateRole,
    removeMember,
  } = useMembers(workspaceId);

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">Membros</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gerencie os usuários que têm acesso a este workspace.
        </p>
      </div>

      <AddMemberForm loading={saving} onSubmit={addMember} />

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
    </section>
  );
}
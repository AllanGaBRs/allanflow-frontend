import type { Member, MembershipRole } from "../types/member";

type Props = {
  member: Member;
  loading: boolean;
  onUpdateRole: (userId: string, role: MembershipRole) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
};

export function MemberCard({
  member,
  loading,
  onUpdateRole,
  onRemove,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {member.userName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {member.userName}
          </p>
          <p className="text-xs text-slate-500">{member.userEmail}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          disabled={loading || member.role === "OWNER"}
          value={member.role}
          onChange={(e) =>
            onUpdateRole(member.userId, e.target.value as MembershipRole)
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none disabled:bg-slate-100"
        >
          <option value="OWNER">Owner</option>
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Membro</option>
        </select>

        <button
          disabled={loading || member.role === "OWNER"}
          onClick={() => onRemove(member.userId)}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
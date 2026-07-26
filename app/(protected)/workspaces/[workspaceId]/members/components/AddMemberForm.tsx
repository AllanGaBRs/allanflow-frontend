"use client";

import { useState } from "react";
import type { MembershipRole } from "../types/member";

type Props = {
  loading: boolean;
  onSubmit: (email: string, role: MembershipRole) => Promise<boolean>;
};

export function AddMemberForm({ loading, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MembershipRole>("MEMBER");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const created = await onSubmit(email, role);

    if (created) {
      setEmail("");
      setRole("MEMBER");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        Convidar membro
      </h3>

      <div className="grid gap-3">
        <input
          type="email"
          placeholder="email@exemplo.com"
          className="min-h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <select
          className="min-h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={role}
          onChange={(e) => setRole(e.target.value as MembershipRole)}
        >
          <option value="MEMBER">Membro</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Convidar"}
        </button>
      </div>
    </form>
  );
}

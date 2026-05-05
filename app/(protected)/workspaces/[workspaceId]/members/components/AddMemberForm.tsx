"use client";

import { useState } from "react";
import type { MembershipRole } from "../types/member";

type Props = {
  loading: boolean;
  onSubmit: (email: string, role: MembershipRole) => Promise<void>;
};

export function AddMemberForm({ loading, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MembershipRole>("MEMBER");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await onSubmit(email, role);

    setEmail("");
    setRole("MEMBER");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        Adicionar membro
      </h3>

      <div className="grid gap-3 md:grid-cols-[1fr_140px_auto]">
        <input
          type="email"
          placeholder="email@exemplo.com"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          value={role}
          onChange={(e) => setRole(e.target.value as MembershipRole)}
        >
          <option value="MEMBER">Membro</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>
      </div>
    </form>
  );
}
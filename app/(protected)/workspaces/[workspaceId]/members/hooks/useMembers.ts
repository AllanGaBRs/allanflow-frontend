"use client";

import { useEffect, useState } from "react";
import {
  addMemberService,
  getMembersService,
  removeMemberService,
  updateMemberRoleService,
} from "../services/memberService";
import type { Member, MembershipRole } from "../types/member";

export function useMembers(workspaceId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadMembers() {
    setLoading(true);
    setError("");

    try {
      const data = await getMembersService(workspaceId);
      setMembers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar membros");
    } finally {
      setLoading(false);
    }
  }

  async function addMember(email: string, role: MembershipRole) {
    setSaving(true);
    setError("");

    try {
      const member = await addMemberService(workspaceId, { email, role });
      setMembers((prev) => [...prev, member]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar membro");
    } finally {
      setSaving(false);
    }
  }

  async function updateRole(userId: string, role: MembershipRole) {
    setSaving(true);
    setError("");

    try {
      const updatedMember = await updateMemberRoleService(workspaceId, userId, {
        role,
      });

      setMembers((prev) =>
        prev.map((member) =>
          member.userId === userId ? updatedMember : member
        )
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar membro");
    } finally {
      setSaving(false);
    }
  }

  async function removeMember(userId: string) {
    setSaving(true);
    setError("");

    try {
      await removeMemberService(workspaceId, userId);
      setMembers((prev) => prev.filter((member) => member.userId !== userId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao remover membro");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, [workspaceId]);

  return {
    members,
    loading,
    saving,
    error,
    addMember,
    updateRole,
    removeMember,
    loadMembers,
  };
}
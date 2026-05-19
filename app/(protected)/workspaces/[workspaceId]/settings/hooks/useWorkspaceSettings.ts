"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteWorkspaceService,
  updateWorkspaceService,
} from "../services/workspaceSettingsService";
import type { WorkspaceDetails } from "../../types/workspaceDetails";

export function useWorkspaceSettings(initialWorkspace: WorkspaceDetails) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState(initialWorkspace);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function updateWorkspace(name: string) {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("O nome do workspace deve ter pelo menos 2 caracteres.");
      setSuccess("");
      return false;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedWorkspace = await updateWorkspaceService(workspace.id, {
        name: trimmedName,
      });

      setWorkspace(updatedWorkspace);
      setSuccess("Workspace atualizado com sucesso.");
      router.refresh();
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado ao atualizar."
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteWorkspace() {
    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      await deleteWorkspaceService(workspace.id);
      router.replace("/workspaces");
      router.refresh();
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado ao excluir."
      );
      return false;
    } finally {
      setDeleting(false);
    }
  }

  return {
    workspace,
    saving,
    deleting,
    error,
    success,
    updateWorkspace,
    deleteWorkspace,
  };
}

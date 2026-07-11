"use client";

import { useCallback, useEffect, useState } from "react";
import { WorkspaceLayout } from "./WorkspaceLayout";
import { WorkspaceWelcome } from "./WorkspaceWelcome";
import { WorkspaceCreateModal } from "./WorkspaceCreateModal";
import { WorkspaceDashboardContent } from "./WorkspaceDashboardContent";
import { WorkspaceDashboardHeader } from "./WorkspaceDashboardHeader";
import { useWorkspaces } from "../hooks/useWorkspace";

export function WorkspaceDashboard() {
  const { workspaces, loading, creating, error, createWorkspace } =
    useWorkspaces();
  const [name, setName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await createWorkspace(name);

    if (created) {
      setName("");
      setIsCreateModalOpen(false);
    }
  }

  const closeCreateModal = useCallback(() => {
    if (creating) {
      return;
    }

    setName("");
    setIsCreateModalOpen(false);
  }, [creating]);

  useEffect(() => {
    if (!isCreateModalOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCreateModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCreateModal, isCreateModalOpen]);

  return (
    <WorkspaceLayout navVariant="workspaces">
      <section className="w-full px-6 py-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <WorkspaceWelcome totalWorkspaces={workspaces.length} />

          <div className="min-w-0">
            <WorkspaceDashboardHeader
              onCreateWorkspace={() => setIsCreateModalOpen(true)}
            />

            <WorkspaceDashboardContent
              workspaces={workspaces}
              loading={loading}
              error={error}
            />
          </div>

          {isCreateModalOpen && (
            <WorkspaceCreateModal
              name={name}
              loading={creating}
              onClose={closeCreateModal}
              onNameChange={setName}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </section>
    </WorkspaceLayout>
  );
}

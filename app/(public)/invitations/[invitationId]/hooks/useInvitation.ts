"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/app/(protected)/types/user";
import {
  acceptWorkspaceInvitationService,
  getWorkspaceInvitationService,
} from "../services/invitationService";
import { getCurrentSessionService } from "../services/sessionService";
import type { WorkspaceInvitation } from "../types/invitation";

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export function useInvitation(invitationId: string) {
  const router = useRouter();
  const [invitation, setInvitation] = useState<WorkspaceInvitation | null>(null);
  const [session, setSession] = useState<AuthUser | null>(null);
  const [invitationLoading, setInvitationLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvitation() {
      setInvitationLoading(true);
      setError("");

      try {
        const data = await getWorkspaceInvitationService(invitationId);

        if (active) {
          setInvitation(data);
        }
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        setInvitation(null);
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o convite."
        );
      } finally {
        if (active) {
          setInvitationLoading(false);
        }
      }
    }

    void loadInvitation();

    return () => {
      active = false;
    };
  }, [invitationId]);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      setSessionLoading(true);
      setSessionError("");

      try {
        const data = await getCurrentSessionService();

        if (active) {
          setSession(data);
        }
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        setSession(null);
        setSessionError(
          err instanceof Error
            ? err.message
            : "Não foi possível verificar sua sessão."
        );
      } finally {
        if (active) {
          setSessionLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  async function acceptInvitation(code: string) {
    setSubmitting(true);
    setError("");

    try {
      if (!session) {
        setError("Faça login para aceitar este convite.");
        return false;
      }

      await acceptWorkspaceInvitationService(invitationId, {
        code: normalizeCode(code),
      });

      router.push("/workspaces");
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível aceitar o convite. Tente novamente."
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    invitation,
    invitationLoading,
    session,
    sessionLoading,
    submitting,
    error,
    sessionError,
    acceptInvitation,
  };
}

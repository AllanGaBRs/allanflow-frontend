"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addBoardMemberService,
  getBoardMembersService,
  removeBoardMemberService,
} from "../services/boardMemberService";
import type { BoardMember } from "../types/boardMember";

export function useBoardMembers(workspaceId: string, boardId?: string) {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loadingBoardMembers, setLoadingBoardMembers] = useState(false);
  const [savingBoardMember, setSavingBoardMember] = useState(false);
  const [boardMembersError, setBoardMembersError] = useState("");

  const loadBoardMembers = useCallback(async () => {
    if (!boardId) {
      setBoardMembers([]);
      return;
    }

    setLoadingBoardMembers(true);
    setBoardMembersError("");

    try {
      const data = await getBoardMembersService(workspaceId, boardId);
      setBoardMembers(data);
    } catch (err: unknown) {
      setBoardMembersError(
        err instanceof Error ? err.message : "Erro ao buscar membros do board"
      );
    } finally {
      setLoadingBoardMembers(false);
    }
  }, [workspaceId, boardId]);

  async function addBoardMember(userId: string) {
    if (!boardId) {
      return false;
    }

    setSavingBoardMember(true);
    setBoardMembersError("");

    try {
      const member = await addBoardMemberService(workspaceId, boardId, {
        userId,
      });
      setBoardMembers((prev) => [...prev, member]);
      return true;
    } catch (err: unknown) {
      setBoardMembersError(
        err instanceof Error ? err.message : "Erro ao adicionar membro ao board"
      );
      return false;
    } finally {
      setSavingBoardMember(false);
    }
  }

  async function removeBoardMember(userId: string) {
    if (!boardId) {
      return false;
    }

    setSavingBoardMember(true);
    setBoardMembersError("");

    try {
      await removeBoardMemberService(workspaceId, boardId, userId);
      setBoardMembers((prev) =>
        prev.filter((member) => member.userId !== userId)
      );
      return true;
    } catch (err: unknown) {
      setBoardMembersError(
        err instanceof Error ? err.message : "Erro ao remover membro do board"
      );
      return false;
    } finally {
      setSavingBoardMember(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialBoardMembers() {
      if (!boardId) {
        setBoardMembers([]);
        return;
      }

      if (active) {
        setLoadingBoardMembers(true);
        setBoardMembersError("");
      }

      try {
        const data = await getBoardMembersService(workspaceId, boardId);

        if (active) {
          setBoardMembers(data);
        }
      } catch (err: unknown) {
        if (active) {
          setBoardMembersError(
            err instanceof Error
              ? err.message
              : "Erro ao buscar membros do board"
          );
        }
      } finally {
        if (active) {
          setLoadingBoardMembers(false);
        }
      }
    }

    void loadInitialBoardMembers();

    return () => {
      active = false;
    };
  }, [workspaceId, boardId]);

  return {
    boardMembers,
    loadingBoardMembers,
    savingBoardMember,
    boardMembersError,
    addBoardMember,
    removeBoardMember,
    loadBoardMembers,
  };
}

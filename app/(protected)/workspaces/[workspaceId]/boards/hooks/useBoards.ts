"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createBoardService,
  deleteBoardService,
  getBoardsService,
  updateBoardService,
} from "../services/boardService";
import type { Board, BoardCreatePayload, BoardUpdatePayload } from "../types/board";

export function useBoards(workspaceId: string) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadBoards = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBoardsService(workspaceId);
      setBoards(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar boards");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  async function createBoard(payload: BoardCreatePayload) {
    const trimmedName = payload.name.trim();
    const trimmedDescription = payload.description?.trim();

    if (trimmedName.length < 2) {
      setError("O nome do board deve ter pelo menos 2 caracteres.");
      return false;
    }

    if (trimmedDescription && trimmedDescription.length > 255) {
      setError("A descrição do board deve ter no máximo 255 caracteres.");
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const board = await createBoardService(workspaceId, {
        name: trimmedName,
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
      });
      setBoards((prev) => [...prev, board]);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar board");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function updateBoard(boardId: string, payload: BoardUpdatePayload) {
    const trimmedName = payload.name?.trim();
    const trimmedDescription = payload.description?.trim();

    if (trimmedName !== undefined && trimmedName.length < 2) {
      setError("O nome do board deve ter pelo menos 2 caracteres.");
      return false;
    }

    if (trimmedDescription && trimmedDescription.length > 255) {
      setError("A descrição do board deve ter no máximo 255 caracteres.");
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const updatedBoard = await updateBoardService(workspaceId, boardId, {
        ...(trimmedName !== undefined ? { name: trimmedName } : {}),
        ...(payload.description !== undefined
          ? { description: trimmedDescription || "" }
          : {}),
      });

      setBoards((prev) =>
        prev.map((board) => (board.id === boardId ? updatedBoard : board))
      );
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar board");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteBoard(boardId: string) {
    setSaving(true);
    setError("");

    try {
      await deleteBoardService(workspaceId, boardId);
      setBoards((prev) => prev.filter((board) => board.id !== boardId));
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao excluir board");
      return false;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialBoards() {
      await Promise.resolve();

      if (active) {
        setLoading(true);
        setError("");
      }

      try {
        const data = await getBoardsService(workspaceId);

        if (active) {
          setBoards(data);
        }
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao buscar boards");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialBoards();

    return () => {
      active = false;
    };
  }, [workspaceId]);

  return {
    boards,
    loading,
    saving,
    error,
    createBoard,
    updateBoard,
    deleteBoard,
    loadBoards,
  };
}

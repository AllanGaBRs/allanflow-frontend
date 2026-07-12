"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createLabelService,
  deleteLabelService,
  getLabelsService,
  updateLabelService,
} from "../services/labelService";
import type { Label } from "../types/label";

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

function normalizeColor(color: string) {
  const trimmedColor = color.trim();
  return trimmedColor.startsWith("#") ? trimmedColor : `#${trimmedColor}`;
}

function validateLabel(name: string, color: string) {
  const trimmedName = name.trim();
  const normalizedColor = normalizeColor(color);

  if (trimmedName.length < 2) {
    return {
      error: "O nome da label deve ter pelo menos 2 caracteres.",
      payload: null,
    };
  }

  if (trimmedName.length > 150) {
    return {
      error: "O nome da label deve ter no máximo 150 caracteres.",
      payload: null,
    };
  }

  if (!HEX_COLOR_REGEX.test(normalizedColor)) {
    return {
      error: "Use uma cor em hexadecimal, como #2563eb.",
      payload: null,
    };
  }

  return {
    error: "",
    payload: {
      name: trimmedName,
      color: normalizedColor,
    },
  };
}

export function useLabels(workspaceId: string, boardId: string | undefined) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(Boolean(boardId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadLabels = useCallback(async () => {
    if (!boardId) {
      setLabels([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getLabelsService(workspaceId, boardId);
      setLabels(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar labels");
    } finally {
      setLoading(false);
    }
  }, [boardId, workspaceId]);

  async function createLabel(name: string, color: string) {
    if (!boardId) {
      return false;
    }

    const { error: validationError, payload } = validateLabel(name, color);

    if (!payload) {
      setError(validationError);
      return false;
    }

    setSaving(true);
    setError("");

    try {
      await createLabelService(workspaceId, boardId, payload);
      await loadLabels();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar label");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function updateLabel(labelId: string, name: string, color: string) {
    if (!boardId) {
      return false;
    }

    const { error: validationError, payload } = validateLabel(name, color);

    if (!payload) {
      setError(validationError);
      return false;
    }

    setSaving(true);
    setError("");

    try {
      await updateLabelService(workspaceId, boardId, labelId, payload);
      await loadLabels();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar label");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteLabel(labelId: string) {
    if (!boardId) {
      return false;
    }

    setSaving(true);
    setError("");

    try {
      await deleteLabelService(workspaceId, boardId, labelId);
      await loadLabels();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao excluir label");
      return false;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialLabels() {
      await Promise.resolve();

      if (!boardId) {
        if (active) {
          setLabels([]);
          setLoading(false);
        }

        return;
      }

      if (active) {
        setLoading(true);
        setError("");
      }

      try {
        const data = await getLabelsService(workspaceId, boardId);

        if (active) {
          setLabels(data);
        }
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao buscar labels");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialLabels();

    return () => {
      active = false;
    };
  }, [boardId, workspaceId]);

  return {
    labels,
    loading,
    saving,
    error,
    createLabel,
    updateLabel,
    deleteLabel,
    loadLabels,
  };
}

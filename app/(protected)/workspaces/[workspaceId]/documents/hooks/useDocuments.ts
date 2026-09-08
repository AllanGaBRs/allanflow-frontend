"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createDocumentService,
  deleteDocumentService,
  getDocumentService,
  getDocumentTreeService,
  moveDocumentService,
  updateDocumentService,
} from "../services/documentService";
import type {
  DocumentContent,
  DocumentCreatePayload,
  DocumentItem,
  DocumentMovePayload,
  DocumentTreeItem,
  DocumentType,
  DocumentUpdatePayload,
} from "../types/document";

type LoadDocumentsOptions = {
  silent?: boolean;
};

function validateTitle(title: string) {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length < 2) {
    return {
      error: "O título do documento deve ter pelo menos 2 caracteres.",
      title: "",
    };
  }

  if (trimmedTitle.length > 255) {
    return {
      error: "O título do documento deve ter no máximo 255 caracteres.",
      title: "",
    };
  }

  return {
    error: "",
    title: trimmedTitle,
  };
}

function createPayload(
  title: string,
  type: DocumentType,
  parentId?: string | null,
  content?: DocumentContent
): DocumentCreatePayload {
  return {
    title,
    type,
    parentId: parentId || null,
    content: type === "FILE" ? content ?? null : null,
  };
}

function updatePayload(
  document: DocumentItem,
  title: string,
  content?: DocumentContent
): DocumentUpdatePayload {
  return {
    title,
    content: document.type === "FILE" ? content ?? null : null,
  };
}

export function useDocuments(
  workspaceId: string,
  boardId: string | undefined
) {
  const [documentsTree, setDocumentsTree] = useState<DocumentTreeItem[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentItem | null>(null);
  const [loadingTree, setLoadingTree] = useState(Boolean(boardId));
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState("");

  const loadDocumentsTree = useCallback(async (
    options: LoadDocumentsOptions = {}
  ) => {
    if (!boardId) {
      setDocumentsTree([]);
      setLoadingTree(false);
      return;
    }

    if (!options.silent) {
      setLoadingTree(true);
    }

    setError("");

    try {
      const data = await getDocumentTreeService(workspaceId, boardId);
      setDocumentsTree(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao buscar documentos"
      );
    } finally {
      if (!options.silent) {
        setLoadingTree(false);
      }
    }
  }, [boardId, workspaceId]);

  async function selectDocument(documentId: string) {
    if (!boardId) {
      return false;
    }

    setLoadingDocument(true);
    setError("");

    try {
      const document = await getDocumentService(
        workspaceId,
        boardId,
        documentId
      );
      setSelectedDocument(document);
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao buscar documento"
      );
      return false;
    } finally {
      setLoadingDocument(false);
    }
  }

  function clearSelectedDocument() {
    setSelectedDocument(null);
    setError("");
  }

  async function createDocument(
    title: string,
    type: DocumentType,
    parentId?: string | null,
    content?: DocumentContent
  ) {
    if (!boardId) {
      return false;
    }

    const validation = validateTitle(title);

    if (validation.error) {
      setError(validation.error);
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const createdDocument = await createDocumentService(
        workspaceId,
        boardId,
        createPayload(validation.title, type, parentId, content)
      );
      await loadDocumentsTree({ silent: true });

      if (createdDocument.type === "FILE") {
        setSelectedDocument(createdDocument);
      }

      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao criar documento"
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function updateSelectedDocument(
    title: string,
    content?: DocumentContent
  ) {
    if (!boardId || !selectedDocument) {
      return false;
    }

    const validation = validateTitle(title);

    if (validation.error) {
      setError(validation.error);
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const updatedDocument = await updateDocumentService(
        workspaceId,
        boardId,
        selectedDocument.id,
        updatePayload(selectedDocument, validation.title, content)
      );
      setSelectedDocument(updatedDocument);
      await loadDocumentsTree({ silent: true });
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar documento"
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteDocument(documentId: string) {
    if (!boardId) {
      return false;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteDocumentService(workspaceId, boardId, documentId);
      await loadDocumentsTree({ silent: true });

      if (selectedDocument?.id === documentId) {
        clearSelectedDocument();
      }

      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao excluir documento"
      );
      return false;
    } finally {
      setDeleting(false);
    }
  }

  async function moveDocument(
    documentId: string,
    parentId: string | null
  ) {
    if (!boardId) {
      return false;
    }

    const payload: DocumentMovePayload = {
      parentId,
    };

    setMoving(true);
    setError("");

    try {
      const movedDocument = await moveDocumentService(
        workspaceId,
        boardId,
        documentId,
        payload
      );
      await loadDocumentsTree({ silent: true });

      if (selectedDocument?.id === documentId) {
        setSelectedDocument(movedDocument);
      }

      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao mover documento"
      );
      return false;
    } finally {
      setMoving(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialDocumentsTree() {
      await Promise.resolve();

      if (!boardId) {
        if (active) {
          setDocumentsTree([]);
          setSelectedDocument(null);
          setLoadingTree(false);
        }

        return;
      }

      if (active) {
        setLoadingTree(true);
        setError("");
      }

      try {
        const data = await getDocumentTreeService(workspaceId, boardId);

        if (active) {
          setDocumentsTree(data);
          setSelectedDocument(null);
        }
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Erro ao buscar documentos"
          );
        }
      } finally {
        if (active) {
          setLoadingTree(false);
        }
      }
    }

    void loadInitialDocumentsTree();

    return () => {
      active = false;
    };
  }, [boardId, workspaceId]);

  return {
    documentsTree,
    selectedDocument,
    loadingTree,
    loadingDocument,
    saving,
    deleting,
    moving,
    error,
    loadDocumentsTree,
    selectDocument,
    clearSelectedDocument,
    createDocument,
    updateSelectedDocument,
    deleteDocument,
    moveDocument,
  };
}

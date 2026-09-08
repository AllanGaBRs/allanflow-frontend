"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import type { ReactNode } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  FileText,
  FolderTree,
  Plus,
} from "lucide-react";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import { useDocuments } from "../hooks/useDocuments";
import type {
  DocumentContent,
  DocumentItem,
  DocumentTreeItem,
  DocumentType,
} from "../types/document";
import { BoardEmptyState } from "./DocumentsPanelEmptyState";
import { DocumentCreateModal } from "./DocumentCreateModal";
import { DocumentDeleteModal } from "./DocumentDeleteModal";
import { DocumentEditor } from "./DocumentEditor";
import { DocumentTree } from "./DocumentTree";

type DocumentsPanelProps = {
  workspaceId: string;
  boardId: string | undefined;
  boardSelector?: ReactNode;
};

type FolderOption = {
  id: string;
  title: string;
  level: number;
};

const emptyDocumentContent = {
  type: "doc",
  content: [],
};

function collectFolders(
  documents: DocumentTreeItem[],
  level = 0
): FolderOption[] {
  return documents.flatMap((document) => {
    if (document.type !== "FOLDER") {
      return [];
    }

    return [
      {
        id: document.id,
        title: document.title,
        level,
      },
      ...collectFolders(document.children, level + 1),
    ];
  });
}

function collectFolderIds(documents: DocumentTreeItem[]): string[] {
  return documents.flatMap((document) => {
    if (document.type !== "FOLDER") {
      return [];
    }

    return [
      document.id,
      ...collectFolderIds(document.children),
    ];
  });
}

function collectDescendantIds(document: DocumentTreeItem): Set<string> {
  const ids = new Set<string>();

  function collect(currentDocument: DocumentTreeItem) {
    currentDocument.children.forEach((child) => {
      ids.add(child.id);
      collect(child);
    });
  }

  collect(document);
  return ids;
}

function findTreeItem(
  documents: DocumentTreeItem[],
  documentId: string
): DocumentTreeItem | null {
  for (const document of documents) {
    if (document.id === documentId) {
      return document;
    }

    const child = findTreeItem(document.children, documentId);

    if (child) {
      return child;
    }
  }

  return null;
}

type DraggedDocument = {
  id: string;
  parentId: string | null;
  type: DocumentType;
};

function contentSnapshot(content: DocumentContent) {
  return JSON.stringify(content ?? null);
}

function documentFromTreeItem(document: DocumentTreeItem): DraggedDocument {
  return {
    id: document.id,
    parentId: document.parentId,
    type: document.type,
  };
}

function documentFromDragEvent(
  event: DragEvent<HTMLDivElement>,
  documents: DocumentTreeItem[]
) {
  const documentId = event.dataTransfer.getData("text/plain");

  if (documentId) {
    const document = findTreeItem(documents, documentId);

    return document ? documentFromTreeItem(document) : null;
  }

  try {
    const payload = JSON.parse(
      event.dataTransfer.getData("application/json")
    ) as { documentId?: string };

    if (!payload.documentId) {
      return null;
    }

    const document = findTreeItem(documents, payload.documentId);

    return document ? documentFromTreeItem(document) : null;
  } catch {
    return null;
  }
}

function isFolderDropTarget(event: DragEvent<HTMLDivElement>) {
  return Boolean(
    (event.target as HTMLElement | null)?.closest(
      "[data-document-drop-target='folder']"
    )
  );
}

function hasDocumentDragData(
  event: DragEvent<HTMLDivElement>,
  hasDraggedDocument: boolean
) {
  const types = Array.from(event.dataTransfer.types);

  return (
    types.includes("text/plain") ||
    types.includes("application/json") ||
    hasDraggedDocument
  );
}

type SelectedDocumentEditorProps = {
  document: DocumentItem;
  deleting: boolean;
  loadingDocument: boolean;
  onAutoSave: (title: string, content: DocumentContent) => Promise<boolean>;
};

function SelectedDocumentEditor({
  document,
  deleting,
  loadingDocument,
  onAutoSave,
}: SelectedDocumentEditorProps) {
  const [draftTitle, setDraftTitle] = useState(document.title);
  const [draftContent, setDraftContent] = useState<DocumentContent>(
    document.content
  );
  const [saveStatus, setSaveStatus] = useState("Salvo");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedSnapshotRef = useRef({
    title: document.title.trim(),
    content: contentSnapshot(document.content),
  });
  const editorDisabled = deleting || loadingDocument;

  function clearScheduledSave() {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }

  function scheduleAutoSave(title: string, content: DocumentContent) {
    clearScheduledSave();

    const trimmedTitle = title.trim();
    const nextContentSnapshot = contentSnapshot(content);

    if (trimmedTitle.length < 2) {
      setSaveStatus("Título muito curto");
      return;
    }

    if (
      trimmedTitle === lastSavedSnapshotRef.current.title &&
      nextContentSnapshot === lastSavedSnapshotRef.current.content
    ) {
      setSaveStatus("Salvo");
      return;
    }

    setSaveStatus("Aguardando...");
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus("Salvando...");
      void onAutoSave(trimmedTitle, content).then((saved) => {
        if (saved) {
          lastSavedSnapshotRef.current = {
            title: trimmedTitle,
            content: nextContentSnapshot,
          };
        }

        setSaveStatus(saved ? "Salvo" : "Erro ao salvar");
      });
    }, 3000);
  }

  useEffect(() => clearScheduledSave, []);

  return (
    <div
      key={document.id}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="border-b border-slate-200 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="selected-document-title"
              className="sr-only"
            >
              Título
            </label>
            <input
              id="selected-document-title"
              type="text"
              value={draftTitle}
              minLength={2}
              maxLength={255}
              disabled={editorDisabled}
              onChange={(event) => {
                const nextTitle = event.target.value;

                setDraftTitle(nextTitle);
                scheduleAutoSave(nextTitle, draftContent);
              }}
              className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-base font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
            />
            {document.type === "FOLDER" && (
              <p className="mt-2 text-xs font-medium text-slate-500">
                Pasta · {saveStatus}
              </p>
            )}
          </div>
        </div>

      </div>

      <div className="min-h-0 flex-1 p-4">
        {loadingDocument && (
          <p className="text-sm text-slate-500">
            Carregando documento...
          </p>
        )}

        {!loadingDocument && document.type === "FOLDER" && (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-sm text-slate-500">
            Pastas organizam documentos e não possuem conteúdo editável.
          </div>
        )}

        {!loadingDocument && document.type === "FILE" && (
          <DocumentEditor
            content={document.content}
            disabled={editorDisabled}
            statusLabel={`Documento · ${saveStatus}`}
            onChange={(nextContent) => {
              setDraftContent(nextContent);
              scheduleAutoSave(draftTitle, nextContent);
            }}
          />
        )}
      </div>
    </div>
  );
}

export function DocumentsPanel({
  workspaceId,
  boardId,
  boardSelector,
}: DocumentsPanelProps) {
  const {
    documentsTree,
    selectedDocument,
    loadingTree,
    loadingDocument,
    saving,
    deleting,
    moving,
    error,
    selectDocument,
    clearSelectedDocument,
    createDocument,
    updateSelectedDocument,
    deleteDocument,
    moveDocument,
  } = useDocuments(workspaceId, boardId);
  const [createTitle, setCreateTitle] = useState("");
  const [createType, setCreateType] = useState<DocumentType>("FILE");
  const [createParentId, setCreateParentId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<
    DocumentItem | DocumentTreeItem | null
  >(null);
  const [draggedDocument, setDraggedDocument] =
    useState<DraggedDocument | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [dragOverRoot, setDragOverRoot] = useState(false);
  const [collapsedFolderIds, setCollapsedFolderIds] = useState<Set<string>>(
    () => new Set()
  );
  const [structureCollapsed, setStructureCollapsed] = useState(false);
  const [localError, setLocalError] = useState("");
  const draggedDocumentRef = useRef<DraggedDocument | null>(null);
  const dropLocked = useRef(false);
  const knownFolderIdsRef = useRef<Set<string>>(new Set());
  const folderOptions = useMemo(
    () => collectFolders(documentsTree),
    [documentsTree]
  );
  const actionLoading = saving || deleting || moving || loadingDocument;
  const dragLocked = deleting || moving || loadingDocument;
  useToastMessage(documentToDelete ? localError : error || localError, {
    title: "Erro nos documentos",
  });

  useEffect(() => {
    const folderIds = collectFolderIds(documentsTree);
    const nextKnownFolderIds = new Set(folderIds);

    setCollapsedFolderIds((currentCollapsedFolderIds) => {
      const nextCollapsedFolderIds = new Set<string>();

      folderIds.forEach((folderId) => {
        const isNewFolder = !knownFolderIdsRef.current.has(folderId);

        if (currentCollapsedFolderIds.has(folderId) || isNewFolder) {
          nextCollapsedFolderIds.add(folderId);
        }
      });

      return nextCollapsedFolderIds;
    });

    knownFolderIdsRef.current = nextKnownFolderIds;
  }, [documentsTree]);

  function clearDragState() {
    draggedDocumentRef.current = null;
    setDraggedDocument(null);
    setDragOverFolderId(null);
    setDragOverRoot(false);
    window.setTimeout(() => {
      dropLocked.current = false;
    }, 0);
  }

  function handleToggleFolder(documentId: string) {
    setCollapsedFolderIds((currentCollapsedFolderIds) => {
      const nextCollapsedFolderIds = new Set(currentCollapsedFolderIds);

      if (nextCollapsedFolderIds.has(documentId)) {
        nextCollapsedFolderIds.delete(documentId);
      } else {
        nextCollapsedFolderIds.add(documentId);
      }

      return nextCollapsedFolderIds;
    });
  }

  function canDropDocument(
    targetParentId: string | null,
    documentToMove = draggedDocumentRef.current ?? draggedDocument
  ) {
    if (!documentToMove) {
      return false;
    }

    if (documentToMove.parentId === targetParentId) {
      return false;
    }

    if (!targetParentId) {
      return true;
    }

    if (documentToMove.id === targetParentId) {
      return false;
    }

    const targetParent = findTreeItem(documentsTree, targetParentId);

    if (!targetParent || targetParent.type !== "FOLDER") {
      return false;
    }

    if (documentToMove.type === "FOLDER") {
      const draggedTreeItem = findTreeItem(documentsTree, documentToMove.id);

      if (draggedTreeItem) {
        return !collectDescendantIds(draggedTreeItem).has(targetParentId);
      }
    }

    return true;
  }

  function handleDocumentDragStart(
    event: DragEvent<HTMLButtonElement>,
    document: DocumentTreeItem
  ) {
    if (dragLocked || dropLocked.current) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", document.id);
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ documentId: document.id })
    );
    setLocalError("");
    const nextDraggedDocument = documentFromTreeItem(document);

    draggedDocumentRef.current = nextDraggedDocument;
    setDraggedDocument(nextDraggedDocument);
  }

  function handleDragOverRoot(event: DragEvent<HTMLDivElement>) {
    if (isFolderDropTarget(event)) {
      return;
    }

    event.stopPropagation();

    if (
      dragLocked ||
      dropLocked.current ||
      !hasDocumentDragData(
        event,
        Boolean(draggedDocumentRef.current ?? draggedDocument)
      )
    ) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverFolderId(null);
    setDragOverRoot(canDropDocument(null));
  }

  function handleDragOverFolder(
    event: DragEvent<HTMLDivElement>,
    document: DocumentTreeItem
  ) {
    event.stopPropagation();

    if (!canDropDocument(document.id)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverRoot(false);
    setDragOverFolderId(document.id);
  }

  async function handleDropOnParent(
    targetParentId: string | null,
    event?: DragEvent<HTMLDivElement>
  ) {
    const eventDocument = event
      ? documentFromDragEvent(event, documentsTree)
      : null;
    const documentToMove =
      eventDocument ??
      draggedDocumentRef.current ??
      draggedDocument;

    if (targetParentId === null && documentToMove?.parentId === null) {
      clearDragState();
      return;
    }

    if (
      dropLocked.current ||
      dragLocked ||
      !documentToMove ||
      !canDropDocument(targetParentId, documentToMove)
    ) {
      if (!documentToMove) {
        setLocalError("Não foi possível identificar o documento arrastado.");
      }

      clearDragState();
      return;
    }

    dropLocked.current = true;

    try {
      const moved = await moveDocument(documentToMove.id, targetParentId);

      if (!moved) {
        setLocalError("Não foi possível mover o documento.");
      }
    } finally {
      clearDragState();
    }
  }

  async function handleDropOnRoot(event: DragEvent<HTMLDivElement>) {
    if (isFolderDropTarget(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    await handleDropOnParent(null, event);
  }

  async function handleDropOnFolder(
    event: DragEvent<HTMLDivElement>,
    document: DocumentTreeItem
  ) {
    event.preventDefault();
    event.stopPropagation();
    await handleDropOnParent(document.id, event);
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await createDocument(
      createTitle,
      createType,
      createParentId || null,
      createType === "FILE" ? emptyDocumentContent : null
    );

    if (created) {
      setCreateTitle("");
      setCreateType("FILE");
      setCreateParentId("");
      setCreateOpen(false);
    }
  }

  async function handleAutoSave(title: string, content: DocumentContent) {
    if (!selectedDocument) {
      return false;
    }

    setLocalError("");
    return updateSelectedDocument(title, content);
  }

  async function handleDelete(document: DocumentItem | DocumentTreeItem) {
    const deleted = await deleteDocument(document.id);

    if (deleted && selectedDocument?.id === document.id) {
      clearSelectedDocument();
    }

    return deleted;
  }

  if (!boardId) {
    return (
      <BoardEmptyState
        title="Selecione um board"
        description="Os documentos aparecem quando um board estiver selecionado."
      />
    );
  }

  return (
    <section
      className={`grid min-h-0 min-w-0 flex-1 gap-4 overflow-hidden ${
        structureCollapsed
          ? "lg:grid-cols-[3.5rem_minmax(0,1fr)]"
          : "lg:grid-cols-[22rem_minmax(0,1fr)]"
      }`}
    >
      <aside className="flex min-h-0 min-w-0 flex-col rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div
            className={`flex items-center gap-3 ${
              structureCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!structureCollapsed && (
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-slate-950">
                  Documentos
                </h2>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {loadingTree ? "Carregando..." : `${documentsTree.length} itens na raiz`}
                </p>
              </div>
            )}

            {!structureCollapsed && (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                disabled={actionLoading}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={15} />
                Criar
              </button>
            )}

            <button
              type="button"
              onClick={() => setStructureCollapsed((collapsed) => !collapsed)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              aria-label={
                structureCollapsed
                  ? "Expandir estrutura de documentos"
                  : "Minimizar estrutura de documentos"
              }
              title={structureCollapsed ? "Expandir" : "Minimizar"}
            >
              {structureCollapsed ? (
                <ChevronsRight size={16} />
              ) : (
                <ChevronsLeft size={16} />
              )}
            </button>
          </div>

          {!structureCollapsed && boardSelector && (
            <div className="mt-3">
              {boardSelector}
            </div>
          )}

          {!structureCollapsed && createOpen && (
            <DocumentCreateModal
              title={createTitle}
              type={createType}
              parentId={createParentId}
              folders={folderOptions}
              loading={saving}
              onTitleChange={setCreateTitle}
              onTypeChange={setCreateType}
              onParentChange={setCreateParentId}
              onClose={() => {
                setCreateOpen(false);
                setCreateTitle("");
                setCreateType("FILE");
                setCreateParentId("");
              }}
              onSubmit={handleCreate}
            />
          )}
        </div>

        {!structureCollapsed && (
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {loadingTree && (
              <p className="px-2 py-3 text-sm text-slate-500">
                Carregando documentos...
              </p>
            )}

            {!loadingTree && documentsTree.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
                Nenhum documento criado ainda.
              </p>
            )}

            {!loadingTree && (
              <div
                onDragOver={handleDragOverRoot}
                onDrop={(event) => void handleDropOnRoot(event)}
                className={`min-h-full space-y-2 rounded-lg transition ${
                  dragOverRoot
                    ? "bg-blue-50/60 ring-2 ring-inset ring-blue-100"
                    : ""
                }`}
              >
                <div
                  onDragEnter={handleDragOverRoot}
                  onDragOver={handleDragOverRoot}
                  onDragLeave={() => setDragOverRoot(false)}
                  onDrop={(event) => void handleDropOnRoot(event)}
                  className={`flex min-h-12 items-center gap-2 rounded-lg border border-dashed px-3 text-sm transition ${
                    dragOverRoot
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  <FolderTree size={16} className="shrink-0" />
                  <span className="font-medium">Raiz</span>
                </div>

                {documentsTree.length > 0 && (
                  <DocumentTree
                    documents={documentsTree}
                    selectedDocumentId={selectedDocument?.id}
                    draggingDocumentId={draggedDocument?.id}
                    dragOverFolderId={dragOverFolderId}
                    collapsedFolderIds={collapsedFolderIds}
                    disabled={actionLoading}
                    dragDisabled={dragLocked}
                    onSelect={(documentId) => void selectDocument(documentId)}
                    onToggleFolder={handleToggleFolder}
                    onCreate={(type, parentId) => {
                      setCreateType(type);
                      setCreateParentId(parentId ?? "");
                      setCreateOpen(true);
                    }}
                    onDelete={setDocumentToDelete}
                    onDragStart={handleDocumentDragStart}
                    onDragEnd={clearDragState}
                    onDragOverFolder={handleDragOverFolder}
                    onDropOnFolder={(event, document) =>
                      void handleDropOnFolder(event, document)
                    }
                  />
                )}
              </div>
            )}
          </div>
        )}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-col rounded-lg border border-slate-200 bg-white">
        {!selectedDocument && (
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <div className="max-w-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText size={28} />
              </div>
              <h2 className="text-lg font-semibold text-slate-950">
                Selecione um documento
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                A árvore fica à esquerda. Ao abrir um arquivo, o conteúdo aparece aqui.
              </p>
            </div>
          </div>
        )}

        {selectedDocument && (
          <SelectedDocumentEditor
            key={selectedDocument.id}
            document={selectedDocument}
            deleting={deleting}
            loadingDocument={loadingDocument}
            onAutoSave={handleAutoSave}
          />
        )}
      </div>

      {documentToDelete && (
        <DocumentDeleteModal
          document={documentToDelete}
          loading={deleting}
          error={error}
          onClose={() => setDocumentToDelete(null)}
          onConfirm={() => handleDelete(documentToDelete)}
        />
      )}
    </section>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  FileText,
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

function contentSnapshot(content: DocumentContent) {
  return JSON.stringify(content ?? null);
}

type SelectedDocumentEditorProps = {
  document: DocumentItem;
  actionLoading: boolean;
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
    error,
    selectDocument,
    clearSelectedDocument,
    createDocument,
    updateSelectedDocument,
    deleteDocument,
  } = useDocuments(workspaceId, boardId);
  const [createTitle, setCreateTitle] = useState("");
  const [createType, setCreateType] = useState<DocumentType>("FILE");
  const [createParentId, setCreateParentId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [localError, setLocalError] = useState("");
  const folderOptions = useMemo(
    () => collectFolders(documentsTree),
    [documentsTree]
  );
  const actionLoading = saving || deleting || loadingDocument;
  useToastMessage(error || localError, { title: "Erro nos documentos" });

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
    <section className="grid min-h-0 min-w-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[22rem_minmax(0,1fr)]">
      <aside className="flex min-h-0 min-w-0 flex-col rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-950">
                Documentos
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {loadingTree ? "Carregando..." : `${documentsTree.length} itens na raiz`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              disabled={actionLoading}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={15} />
              Criar
            </button>
          </div>

          {boardSelector && (
            <div className="mt-3">
              {boardSelector}
            </div>
          )}

          {createOpen && (
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

          {!loadingTree && documentsTree.length > 0 && (
            <DocumentTree
              documents={documentsTree}
              selectedDocumentId={selectedDocument?.id}
              disabled={actionLoading}
              onSelect={(documentId) => void selectDocument(documentId)}
              onCreate={(type, parentId) => {
                setCreateType(type);
                setCreateParentId(parentId ?? "");
                setCreateOpen(true);
              }}
              onDelete={(document) => void handleDelete(document)}
            />
          )}
        </div>
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
    </section>
  );
}

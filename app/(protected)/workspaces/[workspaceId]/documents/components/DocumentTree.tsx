"use client";

import { FileText, Folder, FolderPlus, Plus, Trash2 } from "lucide-react";
import type { DocumentTreeItem } from "../types/document";

type DocumentTreeProps = {
  documents: DocumentTreeItem[];
  selectedDocumentId?: string;
  disabled?: boolean;
  onSelect: (documentId: string) => void;
  onCreate: (type: "FILE" | "FOLDER", parentId: string | null) => void;
  onDelete: (document: DocumentTreeItem) => void;
};

type DocumentTreeNodeProps = DocumentTreeProps & {
  document: DocumentTreeItem;
  level: number;
};

function DocumentTreeNode({
  document,
  level,
  documents,
  selectedDocumentId,
  disabled,
  onSelect,
  onCreate,
  onDelete,
}: DocumentTreeNodeProps) {
  const isFolder = document.type === "FOLDER";
  const isSelected = document.id === selectedDocumentId;
  const Icon = isFolder ? Folder : FileText;

  return (
    <li>
      <div
        className={`group flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm transition ${
          isSelected
            ? "bg-blue-50 text-blue-700"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
      >
        <button
          type="button"
          onClick={() => onSelect(document.id)}
          disabled={disabled}
          className="flex min-w-0 flex-1 items-center gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon
            size={16}
            className={isFolder ? "shrink-0 text-amber-500" : "shrink-0 text-slate-500"}
          />
          <span className="truncate font-medium">{document.title}</span>
        </button>

        {isFolder && (
          <div className="hidden shrink-0 items-center gap-1 group-hover:flex group-focus-within:flex">
            <button
              type="button"
              onClick={() => onCreate("FILE", document.id)}
              disabled={disabled}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={`Criar documento em ${document.title}`}
              title="Criar documento"
            >
              <Plus size={14} />
            </button>
            <button
              type="button"
              onClick={() => onCreate("FOLDER", document.id)}
              disabled={disabled}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={`Criar pasta em ${document.title}`}
              title="Criar pasta"
            >
              <FolderPlus size={14} />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => onDelete(document)}
          disabled={disabled}
          className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 group-hover:flex group-focus-within:flex"
          aria-label={`Excluir ${document.title}`}
          title="Excluir"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isFolder && document.children.length > 0 && (
        <ul className="mt-1 space-y-1">
          {document.children.map((child) => (
            <DocumentTreeNode
              key={child.id}
              document={child}
              documents={documents}
              level={level + 1}
              selectedDocumentId={selectedDocumentId}
              disabled={disabled}
              onSelect={onSelect}
              onCreate={onCreate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DocumentTree({
  documents,
  selectedDocumentId,
  disabled = false,
  onSelect,
  onCreate,
  onDelete,
}: DocumentTreeProps) {
  return (
    <ul className="space-y-1">
      {documents.map((document) => (
        <DocumentTreeNode
          key={document.id}
          document={document}
          documents={documents}
          level={0}
          selectedDocumentId={selectedDocumentId}
          disabled={disabled}
          onSelect={onSelect}
          onCreate={onCreate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

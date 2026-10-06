"use client";

import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderPlus,
  Plus,
  Trash2,
} from "lucide-react";
import type { DragEvent } from "react";
import type { DocumentTreeItem } from "../types/document";

type DocumentTreeProps = {
  documents: DocumentTreeItem[];
  selectedDocumentId?: string;
  draggingDocumentId?: string | null;
  dragOverFolderId?: string | null;
  collapsedFolderIds?: Set<string>;
  disabled?: boolean;
  dragDisabled?: boolean;
  onSelect: (documentId: string) => void;
  onToggleFolder: (documentId: string) => void;
  onCreate: (type: "FILE" | "FOLDER", parentId: string | null) => void;
  onDelete: (document: DocumentTreeItem) => void;
  onDragStart: (
    event: DragEvent<HTMLButtonElement>,
    document: DocumentTreeItem
  ) => void;
  onDragEnd: () => void;
  onDragOverFolder: (
    event: DragEvent<HTMLDivElement>,
    document: DocumentTreeItem
  ) => void;
  onDropOnFolder: (
    event: DragEvent<HTMLDivElement>,
    document: DocumentTreeItem
  ) => void;
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
  draggingDocumentId,
  dragOverFolderId,
  collapsedFolderIds,
  disabled,
  dragDisabled,
  onSelect,
  onToggleFolder,
  onCreate,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOverFolder,
  onDropOnFolder,
}: DocumentTreeNodeProps) {
  const isFolder = document.type === "FOLDER";
  const isSelected = document.id === selectedDocumentId;
  const isDragging = document.id === draggingDocumentId;
  const isDragOver = document.id === dragOverFolderId;
  const isCollapsed = isFolder && collapsedFolderIds?.has(document.id);
  const Icon = isFolder ? Folder : FileText;

  return (
    <li className={isDragging ? "opacity-50" : ""}>
      <div
        data-document-drop-target={isFolder ? "folder" : undefined}
        className={`group flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm transition ${
          isDragOver
            ? "bg-blue-50 text-blue-700 ring-2 ring-blue-100"
            : isSelected
            ? "bg-blue-50 text-blue-700"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onDragOver={
          isFolder
            ? (event) => onDragOverFolder(event, document)
            : undefined
        }
        onDrop={
          isFolder
            ? (event) => onDropOnFolder(event, document)
            : undefined
        }
      >
        {isFolder ? (
          <button
            type="button"
            draggable={false}
            onClick={() => onToggleFolder(document.id)}
            disabled={disabled}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={
              isCollapsed
                ? `Expandir ${document.title}`
                : `Minimizar ${document.title}`
            }
            title={isCollapsed ? "Expandir" : "Minimizar"}
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        ) : (
          <span className="h-6 w-6 shrink-0" aria-hidden="true" />
        )}

        <button
          type="button"
          draggable={!dragDisabled}
          onDragStart={(event) => onDragStart(event, document)}
          onDragEnd={onDragEnd}
          onClick={() => {
            if (!disabled) {
              onSelect(document.id);
            }
          }}
          aria-disabled={disabled}
          className={`flex min-w-0 flex-1 select-none items-center gap-2 text-left ${
            dragDisabled
              ? "cursor-not-allowed"
              : "cursor-grab active:cursor-grabbing"
          } ${disabled ? "opacity-60" : ""}`}
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
              draggable={false}
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
              draggable={false}
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
          draggable={false}
          onClick={() => onDelete(document)}
          disabled={disabled}
          className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 group-hover:flex group-focus-within:flex"
          aria-label={`Excluir ${document.title}`}
          title="Excluir"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isFolder && !isCollapsed && document.children.length > 0 && (
        <ul className="mt-1 space-y-1">
          {document.children.map((child) => (
            <DocumentTreeNode
              key={child.id}
              document={child}
              documents={documents}
              level={level + 1}
              selectedDocumentId={selectedDocumentId}
              draggingDocumentId={draggingDocumentId}
              dragOverFolderId={dragOverFolderId}
              collapsedFolderIds={collapsedFolderIds}
              disabled={disabled}
              dragDisabled={dragDisabled}
              onSelect={onSelect}
              onToggleFolder={onToggleFolder}
              onCreate={onCreate}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOverFolder={onDragOverFolder}
              onDropOnFolder={onDropOnFolder}
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
  draggingDocumentId,
  dragOverFolderId,
  collapsedFolderIds,
  disabled = false,
  dragDisabled = disabled,
  onSelect,
  onToggleFolder,
  onCreate,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOverFolder,
  onDropOnFolder,
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
          draggingDocumentId={draggingDocumentId}
          dragOverFolderId={dragOverFolderId}
          collapsedFolderIds={collapsedFolderIds}
          disabled={disabled}
          dragDisabled={dragDisabled}
          onSelect={onSelect}
          onToggleFolder={onToggleFolder}
          onCreate={onCreate}
          onDelete={onDelete}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOverFolder={onDragOverFolder}
          onDropOnFolder={onDropOnFolder}
        />
      ))}
    </ul>
  );
}

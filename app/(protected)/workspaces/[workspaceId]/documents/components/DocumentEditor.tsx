"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import type { Editor } from "@tiptap/core";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import type { DocumentContent } from "../types/document";

type DocumentEditorProps = {
  content: DocumentContent;
  disabled: boolean;
  statusLabel?: string;
  onChange: (content: DocumentContent) => void;
};

type EditorButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const emptyEditorContent = {
  type: "doc",
  content: [],
};

const inactiveEditorState = {
  isHeading1: false,
  isHeading2: false,
  isBold: false,
  isItalic: false,
  isBulletList: false,
  isOrderedList: false,
  isBlockquote: false,
  isCodeBlock: false,
  canBold: false,
  canItalic: false,
  canUndo: false,
  canRedo: false,
};

function normalizeContent(content: DocumentContent) {
  return content ?? emptyEditorContent;
}

function EditorButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: EditorButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  disabled,
  statusLabel,
}: {
  editor: Editor | null;
  disabled: boolean;
  statusLabel?: string;
}) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      isHeading1: currentEditor?.isActive("heading", { level: 1 }) ?? false,
      isHeading2: currentEditor?.isActive("heading", { level: 2 }) ?? false,
      isBold: currentEditor?.isActive("bold") ?? false,
      isItalic: currentEditor?.isActive("italic") ?? false,
      isBulletList: currentEditor?.isActive("bulletList") ?? false,
      isOrderedList: currentEditor?.isActive("orderedList") ?? false,
      isBlockquote: currentEditor?.isActive("blockquote") ?? false,
      isCodeBlock: currentEditor?.isActive("codeBlock") ?? false,
      canBold: currentEditor?.can().chain().focus().toggleBold().run() ?? false,
      canItalic:
        currentEditor?.can().chain().focus().toggleItalic().run() ?? false,
      canUndo: currentEditor?.can().chain().focus().undo().run() ?? false,
      canRedo: currentEditor?.can().chain().focus().redo().run() ?? false,
    }),
  }) ?? inactiveEditorState;

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <EditorButton
          label="Título 1"
          active={editorState.isHeading1}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={16} />
        </EditorButton>
        <EditorButton
          label="Título 2"
          active={editorState.isHeading2}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </EditorButton>
        <EditorButton
          label="Negrito"
          active={editorState.isBold}
          disabled={disabled || !editorState.canBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </EditorButton>
        <EditorButton
          label="Itálico"
          active={editorState.isItalic}
          disabled={disabled || !editorState.canItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </EditorButton>
        <EditorButton
          label="Lista"
          active={editorState.isBulletList}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </EditorButton>
        <EditorButton
          label="Lista numerada"
          active={editorState.isOrderedList}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </EditorButton>
        <EditorButton
          label="Citação"
          active={editorState.isBlockquote}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </EditorButton>
        <EditorButton
          label="Código"
          active={editorState.isCodeBlock}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code size={16} />
        </EditorButton>
        <div className="mx-1 h-6 w-px bg-slate-200" />
        <EditorButton
          label="Desfazer"
          disabled={disabled || !editorState.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={16} />
        </EditorButton>
        <EditorButton
          label="Refazer"
          disabled={disabled || !editorState.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={16} />
        </EditorButton>
      </div>

      {statusLabel && (
        <span className="ml-auto text-xs font-medium text-slate-500">
          {statusLabel}
        </span>
      )}
    </div>
  );
}

export function DocumentEditor({
  content,
  disabled,
  statusLabel,
  onChange,
}: DocumentEditorProps) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Comece a escrever...",
      }),
    ],
    content: normalizeContent(content),
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      handleKeyDown: (view, event) => {
        if (
          event.key !== "Tab" ||
          event.shiftKey ||
          event.ctrlKey ||
          event.altKey ||
          event.metaKey ||
          event.isComposing ||
          !view.editable
        ) {
          return false;
        }

        event.preventDefault();
        view.dispatch(view.state.tr.insertText("    ").scrollIntoView());
        return true;
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChangeRef.current(currentEditor.getJSON());
    },
  }, []);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  return (
    <div className="flex h-full min-h-[24rem] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Toolbar editor={editor} disabled={disabled} statusLabel={statusLabel} />
      <EditorContent
        editor={editor}
        className="document-editor min-h-0 flex-1 overflow-y-auto"
      />
    </div>
  );
}

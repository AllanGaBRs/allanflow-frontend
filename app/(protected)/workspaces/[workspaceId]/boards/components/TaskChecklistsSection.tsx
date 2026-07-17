"use client";

import { useState } from "react";
import {
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { Checklist, ChecklistItem } from "../types/checklist";
import { TaskChecklistDeleteModal } from "./TaskChecklistDeleteModal";

type TaskChecklistsSectionProps = {
  checklists: Checklist[];
  loading: boolean;
  saving: boolean;
  error: string;
  onCreateChecklist: (title: string) => Promise<boolean>;
  onUpdateChecklist: (checklistId: string, title: string) => Promise<boolean>;
  onDeleteChecklist: (checklistId: string) => Promise<boolean>;
  onCreateItem: (
    checklistId: string,
    content: string,
    position?: number | null
  ) => Promise<boolean>;
  onUpdateItem: (
    checklistId: string,
    itemId: string,
    payload: { content?: string; checked?: boolean; position?: number | null }
  ) => Promise<boolean>;
  onDeleteItem: (checklistId: string, itemId: string) => Promise<boolean>;
};

export function TaskChecklistsSection({
  checklists,
  loading,
  saving,
  error,
  onCreateChecklist,
  onUpdateChecklist,
  onDeleteChecklist,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}: TaskChecklistsSectionProps) {
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [itemForms, setItemForms] = useState<Record<string, string>>({});
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(
    null
  );
  const [editingChecklistTitle, setEditingChecklistTitle] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemContent, setEditingItemContent] = useState("");
  const [collapsedChecklistIds, setCollapsedChecklistIds] = useState<
    Record<string, boolean>
  >({});
  const [checklistToDelete, setChecklistToDelete] = useState<Checklist | null>(
    null
  );
  const [itemToDelete, setItemToDelete] = useState<{
    checklist: Checklist;
    item: ChecklistItem;
  } | null>(null);

  function toggleChecklistCollapsed(checklistId: string) {
    setCollapsedChecklistIds((prev) => ({
      ...prev,
      [checklistId]: !prev[checklistId],
    }));
  }

  async function handleCreateChecklist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await onCreateChecklist(newChecklistTitle);

    if (created) {
      setNewChecklistTitle("");
    }
  }

  async function handleUpdateChecklist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingChecklistId) {
      return;
    }

    const updated = await onUpdateChecklist(
      editingChecklistId,
      editingChecklistTitle
    );

    if (updated) {
      setEditingChecklistId(null);
      setEditingChecklistTitle("");
    }
  }

  async function handleCreateItem(
    event: React.FormEvent<HTMLFormElement>,
    checklistId: string
  ) {
    event.preventDefault();

    const created = await onCreateItem(checklistId, itemForms[checklistId] ?? "");

    if (created) {
      setItemForms((prev) => ({
        ...prev,
        [checklistId]: "",
      }));
    }
  }

  async function handleUpdateItem(
    event: React.FormEvent<HTMLFormElement>,
    checklistId: string,
    itemId: string
  ) {
    event.preventDefault();

    const updated = await onUpdateItem(checklistId, itemId, {
      content: editingItemContent,
    });

    if (updated) {
      setEditingItemId(null);
      setEditingItemContent("");
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="mb-4 shrink-0">
        <h3 className="text-base font-semibold text-slate-950">Checklists</h3>
        <p className="mt-1 text-sm text-slate-500">
          Quebre a tarefa em passos pequenos.
        </p>
      </div>

      {error && (
        <div className="mb-4 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreateChecklist}
        className="mb-4 grid shrink-0 gap-2"
      >
        <input
          type="text"
          value={newChecklistTitle}
          onChange={(event) => setNewChecklistTitle(event.target.value)}
          minLength={2}
          maxLength={120}
          disabled={saving}
          placeholder="Novo checklist"
          className="min-h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
        />
        <button
          type="submit"
          disabled={saving || newChecklistTitle.trim().length < 2}
          className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} />
          {saving ? "Criando..." : "Adicionar checklist"}
        </button>
      </form>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {loading && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Carregando checklists...
          </div>
        )}

        {!loading && checklists.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Nenhum checklist ainda.
          </div>
        )}

        {!loading && checklists.length > 0 && (
          <div className="grid gap-4">
            {checklists.map((checklist) => {
              const checkedItems = checklist.items.filter(
                (item) => item.checked
              ).length;
              const totalItems = checklist.items.length;
              const progress =
                totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);
              const collapsed = Boolean(collapsedChecklistIds[checklist.id]);

              return (
                <article
                  key={checklist.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    {editingChecklistId === checklist.id ? (
                      <form
                        onSubmit={handleUpdateChecklist}
                        className="grid min-w-0 flex-1 gap-2"
                      >
                        <input
                          type="text"
                          value={editingChecklistTitle}
                          onChange={(event) =>
                            setEditingChecklistTitle(event.target.value)
                          }
                          minLength={2}
                          maxLength={120}
                          disabled={saving}
                          className="min-h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            disabled={
                              saving || editingChecklistTitle.trim().length < 2
                            }
                            className="inline-flex min-h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Save size={14} />
                            Salvar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingChecklistId(null);
                              setEditingChecklistTitle("");
                            }}
                            disabled={saving}
                            className="inline-flex min-h-8 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <X size={14} />
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleChecklistCollapsed(checklist.id)}
                            disabled={saving}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label={
                              collapsed
                                ? "Expandir checklist"
                                : "Minimizar checklist"
                            }
                          >
                            {collapsed ? (
                              <ChevronRight size={15} />
                            ) : (
                              <ChevronDown size={15} />
                            )}
                          </button>
                          <CheckSquare
                            size={16}
                            className="shrink-0 text-slate-500"
                          />
                          <h4 className="truncate text-sm font-semibold text-slate-950">
                            {checklist.title}
                          </h4>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {checkedItems}/{totalItems} concluídos
                        </p>
                      </div>
                    )}

                    {editingChecklistId !== checklist.id && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingChecklistId(checklist.id);
                            setEditingChecklistTitle(checklist.title);
                          }}
                          disabled={saving}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Editar checklist"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setChecklistToDelete(checklist)}
                          disabled={saving}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Excluir checklist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {!collapsed && (
                    <>
                      <div className="grid gap-2">
                        {checklist.items.length === 0 && (
                          <p className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-sm text-slate-500">
                            Nenhum item ainda.
                          </p>
                        )}

                        {checklist.items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                          >
                            {editingItemId === item.id ? (
                              <form
                                onSubmit={(event) =>
                                  handleUpdateItem(event, checklist.id, item.id)
                                }
                                className="grid gap-2"
                              >
                                <input
                                  type="text"
                                  value={editingItemContent}
                                  onChange={(event) =>
                                    setEditingItemContent(event.target.value)
                                  }
                                  maxLength={255}
                                  disabled={saving}
                                  className="min-h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                                />
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="submit"
                                    disabled={saving || !editingItemContent.trim()}
                                    className="inline-flex min-h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Save size={14} />
                                    Salvar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingItemId(null);
                                      setEditingItemContent("");
                                    }}
                                    disabled={saving}
                                    className="inline-flex min-h-8 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <X size={14} />
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="flex items-start gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    void onUpdateItem(checklist.id, item.id, {
                                      checked: !item.checked,
                                    })
                                  }
                                  disabled={saving}
                                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                    item.checked
                                      ? "border-blue-600 bg-blue-600 text-white"
                                      : "border-slate-300 bg-white text-transparent hover:border-blue-500"
                                  }`}
                                  aria-label={
                                    item.checked
                                      ? "Desmarcar item"
                                      : "Marcar item como concluído"
                                  }
                                >
                                  <Check size={14} />
                                </button>
                                <p
                                  className={`min-w-0 flex-1 wrap-break-word text-sm leading-6 ${
                                    item.checked
                                      ? "text-slate-400 line-through"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {item.content}
                                </p>
                                <div className="flex shrink-0 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingItemId(item.id);
                                      setEditingItemContent(item.content);
                                    }}
                                    disabled={saving}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    aria-label="Editar item"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setItemToDelete({ checklist, item })
                                    }
                                    disabled={saving}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    aria-label="Excluir item"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <form
                        onSubmit={(event) => handleCreateItem(event, checklist.id)}
                        className="mt-3 flex gap-2"
                      >
                        <input
                          type="text"
                          value={itemForms[checklist.id] ?? ""}
                          onChange={(event) =>
                            setItemForms((prev) => ({
                              ...prev,
                              [checklist.id]: event.target.value,
                            }))
                          }
                          maxLength={255}
                          disabled={saving}
                          placeholder="Novo item"
                          className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                        />
                        <button
                          type="submit"
                          disabled={
                            saving || !(itemForms[checklist.id] ?? "").trim()
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Adicionar item"
                        >
                          <Plus size={16} />
                        </button>
                      </form>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {checklistToDelete && (
        <TaskChecklistDeleteModal
          type="checklist"
          checklist={checklistToDelete}
          loading={saving}
          error={error}
          onClose={() => setChecklistToDelete(null)}
          onConfirm={() => onDeleteChecklist(checklistToDelete.id)}
        />
      )}

      {itemToDelete && (
        <TaskChecklistDeleteModal
          type="item"
          checklist={itemToDelete.checklist}
          item={itemToDelete.item}
          loading={saving}
          error={error}
          onClose={() => setItemToDelete(null)}
          onConfirm={() =>
            onDeleteItem(itemToDelete.checklist.id, itemToDelete.item.id)
          }
        />
      )}
    </section>
  );
}

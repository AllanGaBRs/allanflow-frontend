"use client";

import { useState } from "react";
import { AlertCircle, CheckSquare, FileText, Trash2, X } from "lucide-react";
import type { Client } from "../../clients/types/client";
import type { Member } from "../../members/types/member";
import { useTaskChecklists } from "../hooks/useTaskChecklists";
import { useTaskComments } from "../hooks/useTaskComments";
import type { Label } from "../types/label";
import type { Task, TaskForm, TaskPriority } from "../types/task";
import { TaskChecklistsSection } from "./TaskChecklistsSection";
import { TaskCommentsSection } from "./TaskCommentsSection";

type TaskDetailsModalProps = {
  task?: Task;
  workspaceId: string;
  columnName: string;
  mode?: "create" | "edit";
  form: TaskForm;
  labels: Label[];
  clients: Client[];
  members: Member[];
  currentUserId?: string;
  canManageComments: boolean;
  loading: boolean;
  saving: boolean;
  deleting?: boolean;
  error: string;
  onClose: () => void;
  onChange: <K extends keyof TaskForm>(field: K, value: TaskForm[K]) => void;
  onSubmit: () => Promise<boolean>;
  onDeleteRequest?: () => void;
};

const priorities: Array<{ value: TaskPriority; label: string }> = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
];

function toggleId(ids: string[], id: string) {
  return ids.includes(id)
    ? ids.filter((currentId) => currentId !== id)
    : [...ids, id];
}

export function TaskDetailsModal({
  task,
  workspaceId,
  columnName,
  mode = "edit",
  form,
  labels,
  clients,
  members,
  currentUserId,
  canManageComments,
  loading,
  saving,
  deleting = false,
  error,
  onClose,
  onChange,
  onSubmit,
  onDeleteRequest,
}: TaskDetailsModalProps) {
  const [activeMainTab, setActiveMainTab] = useState<"details" | "checklists">(
    "details"
  );
  const busy = loading || saving || deleting;
  const isCreating = mode === "create";
  const taskComments = useTaskComments(
    workspaceId,
    task?.boardId,
    task?.columnId,
    task?.id
  );
  const taskChecklists = useTaskChecklists(
    workspaceId,
    task?.boardId,
    task?.columnId,
    task?.id
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitted = await onSubmit();

    if (submitted) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={isCreating ? "Criar tarefa" : "Detalhes da tarefa"}
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {columnName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className={
            isCreating
              ? "min-h-0 flex-1 overflow-y-auto p-5"
              : "grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_24rem]"
          }
        >
          <div className="flex min-h-0 flex-col p-5">
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {!isCreating && (
              <div
                className="mb-4 flex shrink-0 gap-2 border-b border-slate-200"
                role="tablist"
                aria-label="Seções da tarefa"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeMainTab === "details"}
                  onClick={() => setActiveMainTab("details")}
                  className={`inline-flex min-h-10 items-center justify-center gap-2 border-b-2 px-3 text-sm font-semibold transition ${
                    activeMainTab === "details"
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <FileText size={16} />
                  Detalhes
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeMainTab === "checklists"}
                  onClick={() => setActiveMainTab("checklists")}
                  className={`inline-flex min-h-10 items-center justify-center gap-2 border-b-2 px-3 text-sm font-semibold transition ${
                    activeMainTab === "checklists"
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <CheckSquare size={16} />
                  Checklists
                </button>
              </div>
            )}

            {(isCreating || activeMainTab === "details") && (
            <div className="min-h-0 flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="flex min-h-full flex-col">
              <div className="grid flex-1 content-start gap-4">
                <div>
                  <label
                    htmlFor="task-title"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Título
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    value={form.title}
                    onChange={(event) => onChange("title", event.target.value)}
                    minLength={2}
                    maxLength={200}
                    disabled={busy}
                    className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                    required
                  />
                </div>

            <div>
              <label
                htmlFor="task-description"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Descrição
              </label>
              <textarea
                id="task-description"
                value={form.description}
                onChange={(event) =>
                  onChange("description", event.target.value)
                }
                maxLength={5000}
                rows={7}
                disabled={busy}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Prioridade
                </label>
                <select
                  id="task-priority"
                  value={form.priority}
                  onChange={(event) =>
                    onChange("priority", event.target.value as TaskPriority)
                  }
                  disabled={busy}
                  className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-due-date"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Vencimento
                </label>
                <input
                  id="task-due-date"
                  type="datetime-local"
                  value={form.dueDate}
                  onChange={(event) => onChange("dueDate", event.target.value)}
                  disabled={busy}
                  className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              <div>
                <label
                  htmlFor="task-client"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Cliente
                </label>
                <select
                  id="task-client"
                  value={form.clientId}
                  onChange={(event) => onChange("clientId", event.target.value)}
                  disabled={busy}
                  className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="">Sem cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <fieldset className="min-h-60 rounded-lg border border-slate-200 p-3">
                <legend className="px-1 text-sm font-semibold text-slate-800">
                  Labels
                </legend>
                <div className="mt-2 grid max-h-52 gap-2 overflow-y-auto pr-1">
                  {labels.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Nenhuma label cadastrada.
                    </p>
                  )}
                  {labels.map((label) => (
                    <label
                      key={label.id}
                      className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.labelIds.includes(label.id)}
                        onChange={() =>
                          onChange("labelIds", toggleId(form.labelIds, label.id))
                        }
                        disabled={busy}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                      />
                      <span
                        className="h-3 w-3 shrink-0 rounded-full border border-slate-200"
                        style={{ backgroundColor: label.color }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{label.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="min-h-60 rounded-lg border border-slate-200 p-3">
                <legend className="px-1 text-sm font-semibold text-slate-800">
                  Responsáveis
                </legend>
                <div className="mt-2 grid max-h-52 gap-2 overflow-y-auto pr-1">
                  {members.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Nenhum membro cadastrado.
                    </p>
                  )}
                  {members.map((member) => (
                    <label
                      key={member.userId}
                      className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.assigneeIds.includes(member.userId)}
                        onChange={() =>
                          onChange(
                            "assigneeIds",
                            toggleId(form.assigneeIds, member.userId)
                          )
                        }
                        disabled={busy}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-slate-800">
                          {member.userName}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {member.userEmail}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <div className={`mt-5 flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row ${
            isCreating ? "sm:justify-end" : "sm:justify-between"
          }`}>
            {!isCreating && (
              <button
                type="button"
                onClick={onDeleteRequest}
                disabled={busy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={16} />
                Excluir tarefa
              </button>
            )}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? isCreating
                  ? "Criando..."
                  : "Salvando..."
                : isCreating
                  ? "Criar tarefa"
                  : "Salvar alterações"}
            </button>
          </div>
            </form>
            </div>
            )}

            {!isCreating && activeMainTab === "checklists" && (
              <div className="min-h-0 flex-1">
                <TaskChecklistsSection
                  checklists={taskChecklists.checklists}
                  loading={taskChecklists.loading}
                  saving={taskChecklists.saving}
                  error={taskChecklists.error}
                  onCreateChecklist={taskChecklists.createChecklist}
                  onUpdateChecklist={taskChecklists.updateChecklist}
                  onDeleteChecklist={taskChecklists.deleteChecklist}
                  onCreateItem={taskChecklists.createChecklistItem}
                  onUpdateItem={taskChecklists.updateChecklistItem}
                  onDeleteItem={taskChecklists.deleteChecklistItem}
                />
              </div>
            )}
          </div>

          {!isCreating && (
            <aside className="flex min-h-112 flex-col overflow-hidden border-t border-slate-200 p-5 lg:min-h-0 lg:border-l lg:border-t-0">
              <div className="min-h-0 flex-1">
                <TaskCommentsSection
                  comments={taskComments.comments}
                  loading={taskComments.loading}
                  saving={taskComments.saving}
                  error={taskComments.error}
                  currentUserId={currentUserId}
                  canManageComments={canManageComments}
                  onCreateComment={taskComments.createComment}
                  onUpdateComment={taskComments.updateComment}
                  onDeleteComment={taskComments.deleteComment}
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

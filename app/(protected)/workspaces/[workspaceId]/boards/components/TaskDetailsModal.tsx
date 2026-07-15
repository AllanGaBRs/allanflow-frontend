"use client";

import { AlertCircle, Trash2, X } from "lucide-react";
import type { Client } from "../../clients/types/client";
import type { Member } from "../../members/types/member";
import type { Label } from "../types/label";
import type { Task, TaskForm, TaskPriority } from "../types/task";

type TaskDetailsModalProps = {
  task?: Task;
  columnName: string;
  mode?: "create" | "edit";
  form: TaskForm;
  labels: Label[];
  clients: Client[];
  members: Member[];
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
  columnName,
  mode = "edit",
  form,
  labels,
  clients,
  members,
  loading,
  saving,
  deleting = false,
  error,
  onClose,
  onChange,
  onSubmit,
  onDeleteRequest,
}: TaskDetailsModalProps) {
  const busy = loading || saving || deleting;
  const isCreating = mode === "create";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {columnName}
            </p>
            <h2
              id="task-details-title"
              className="mt-1 break-words text-lg font-semibold text-slate-950"
            >
              {isCreating ? "Nova tarefa" : task?.title}
            </h2>
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

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="grid gap-4">
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
                rows={5}
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
              <fieldset className="rounded-lg border border-slate-200 p-3">
                <legend className="px-1 text-sm font-semibold text-slate-800">
                  Labels
                </legend>
                <div className="mt-2 grid max-h-44 gap-2 overflow-y-auto pr-1">
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

              <fieldset className="rounded-lg border border-slate-200 p-3">
                <legend className="px-1 text-sm font-semibold text-slate-800">
                  Responsáveis
                </legend>
                <div className="mt-2 grid max-h-44 gap-2 overflow-y-auto pr-1">
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
    </div>
  );
}

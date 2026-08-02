import { Search, X } from "lucide-react";
import type { Client } from "../../clients/types/client";
import type { Label } from "../types/label";
import type { TaskPriority } from "../types/task";
import type { BoardTaskFilters } from "../utils/taskFilters";

export type AssigneeFilterOption = {
  userId: string;
  userName: string;
  userEmail: string;
};

type BoardFiltersBarProps = {
  filters: BoardTaskFilters;
  labels: Label[];
  clients: Client[];
  members: AssigneeFilterOption[];
  disabled: boolean;
  hasActiveFilters: boolean;
  onChange: <K extends keyof BoardTaskFilters>(
    field: K,
    value: BoardTaskFilters[K]
  ) => void;
  onClear: () => void;
};

const priorities: Array<{ value: TaskPriority; label: string }> = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
];

function getMemberName(member: AssigneeFilterOption) {
  return member.userName || member.userEmail || "Usuário";
}

export function BoardFiltersBar({
  filters,
  labels,
  clients,
  members,
  disabled,
  hasActiveFilters,
  onChange,
  onClear,
}: BoardFiltersBarProps) {
  const controlClassName =
    "min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

  return (
    <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-7">
      <div className="relative min-w-0 sm:col-span-2 xl:col-span-2">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <label className="sr-only" htmlFor="task-title-filter">
          Buscar task por título
        </label>
        <input
          id="task-title-filter"
          type="search"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          disabled={disabled}
          placeholder="Buscar por título"
          className={`${controlClassName} pl-9`}
        />
      </div>

      <label className="sr-only" htmlFor="task-priority-filter">
        Filtrar por prioridade
      </label>
      <select
        id="task-priority-filter"
        value={filters.priority}
        onChange={(event) =>
          onChange(
            "priority",
            event.target.value as BoardTaskFilters["priority"]
          )
        }
        disabled={disabled}
        className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      >
        <option value="">Prioridade</option>
        {priorities.map((priority) => (
          <option key={priority.value} value={priority.value}>
            {priority.label}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="task-assignee-filter">
        Filtrar por responsável
      </label>
      <select
        id="task-assignee-filter"
        value={filters.assigneeId}
        onChange={(event) => onChange("assigneeId", event.target.value)}
        disabled={disabled || members.length === 0}
        className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      >
        <option value="">Responsável</option>
        {members.map((member) => (
          <option key={member.userId} value={member.userId}>
            {getMemberName(member)}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="task-label-filter">
        Filtrar por label
      </label>
      <select
        id="task-label-filter"
        value={filters.labelId}
        onChange={(event) => onChange("labelId", event.target.value)}
        disabled={disabled || labels.length === 0}
        className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      >
        <option value="">Label</option>
        {labels.map((label) => (
          <option key={label.id} value={label.id}>
            {label.name}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="task-client-filter">
        Filtrar por cliente
      </label>
      <select
        id="task-client-filter"
        value={filters.clientId}
        onChange={(event) => onChange("clientId", event.target.value)}
        disabled={disabled || clients.length === 0}
        className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      >
        <option value="">Cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onClear}
        disabled={disabled || !hasActiveFilters}
        className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:col-span-2 xl:col-span-1"
      >
        <X size={16} />
        Limpar
      </button>
    </div>
  );
}

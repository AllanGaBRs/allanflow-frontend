import { Building2, CalendarDays, Flag, UserRound } from "lucide-react";
import type { DragEvent } from "react";
import type { Task, TaskPriority } from "../types/task";

type TaskCardProps = {
  task: Task;
  dragging?: boolean;
  onDragStart?: (event: DragEvent<HTMLElement>) => void;
  onDragEnd?: () => void;
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

const priorityClasses: Record<TaskPriority, string> = {
  LOW: "border-emerald-200 bg-emerald-50 text-emerald-700",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-700",
  HIGH: "border-red-200 bg-red-50 text-red-700",
};

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dueDate));
}

export function TaskCard({
  task,
  dragging = false,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const dueDate = formatDueDate(task.dueDate);
  const visibleLabels = task.labels.slice(0, 3);
  const extraLabelsCount = task.labels.length - visibleLabels.length;
  const visibleAssignees = task.assignees.slice(0, 2);
  const extraAssigneesCount = task.assignees.length - visibleAssignees.length;

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow active:cursor-grabbing ${
        dragging ? "opacity-50 ring-2 ring-slate-300" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 flex-1 break-words text-sm font-semibold leading-5 text-slate-950">
          {task.title}
        </h4>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${priorityClasses[task.priority]}`}
        >
          <Flag size={12} />
          {priorityLabels[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-3 break-words text-xs leading-5 text-slate-500">
          {task.description}
        </p>
      )}

      {visibleLabels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleLabels.map((label) => (
            <span
              key={label.id}
              className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full border border-slate-200"
                style={{ backgroundColor: label.color || "#cbd5e1" }}
                aria-hidden="true"
              />
              <span className="truncate">{label.name}</span>
            </span>
          ))}

          {extraLabelsCount > 0 && (
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500">
              +{extraLabelsCount}
            </span>
          )}
        </div>
      )}

      {(dueDate || task.client || visibleAssignees.length > 0) && (
        <div className="mt-3 grid gap-2 text-xs text-slate-500">
          {dueDate && (
            <span className="flex min-w-0 items-center gap-1.5">
              <CalendarDays size={14} className="shrink-0" />
              <span className="truncate">{dueDate}</span>
            </span>
          )}

          {task.client && (
            <span className="flex min-w-0 items-center gap-1.5">
              <Building2 size={14} className="shrink-0" />
              <span className="truncate">{task.client.name}</span>
            </span>
          )}

          {visibleAssignees.length > 0 && (
            <span className="flex min-w-0 items-center gap-1.5">
              <UserRound size={14} className="shrink-0" />
              <span className="truncate">
                {visibleAssignees
                  .map((assignee) => assignee.name || assignee.email || "Usuário")
                  .join(", ")}
                {extraAssigneesCount > 0 ? ` +${extraAssigneesCount}` : ""}
              </span>
            </span>
          )}
        </div>
      )}
    </article>
  );
}

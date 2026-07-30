import { Building2, CalendarDays, Flag, UserRound } from "lucide-react";
import type { DragEvent } from "react";
import type { Task, TaskPriority } from "../types/task";

type TaskCardProps = {
  task: Task;
  dragging?: boolean;
  onOpen?: () => void;
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

const priorityAccentClasses: Record<TaskPriority, string> = {
  LOW: "bg-emerald-400",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-red-500",
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

function getDueDateTone(dueDate: string | null) {
  if (!dueDate) {
    return "text-slate-500";
  }

  const dueTime = new Date(dueDate).getTime();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (dueTime < now) {
    return "text-red-600";
  }

  if (dueTime - now <= oneDay) {
    return "text-amber-700";
  }

  return "text-slate-500";
}

export function TaskCard({
  task,
  dragging = false,
  onOpen,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const dueDate = formatDueDate(task.dueDate);
  const dueDateTone = getDueDateTone(task.dueDate);
  const visibleLabels = task.labels.slice(0, 3);
  const extraLabelsCount = task.labels.length - visibleLabels.length;
  const visibleAssignees = task.assignees.slice(0, 2);
  const extraAssigneesCount = task.assignees.length - visibleAssignees.length;

  return (
    <article
      draggable
      onClick={onOpen}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen?.();
        }
      }}
      className={`group relative cursor-grab overflow-hidden rounded-lg border border-slate-200 bg-white p-3 pl-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow active:cursor-grabbing ${
        dragging ? "opacity-50 ring-2 ring-slate-300" : ""
      }`}
    >
      <span
        className={`absolute inset-y-0 left-0 w-1 ${priorityAccentClasses[task.priority]}`}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 flex-1 wrap-break-word text-sm font-semibold leading-5 text-slate-950">
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
        <p className="mt-2 line-clamp-3 wrap-break-word text-xs leading-5 text-slate-500">
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
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
          {dueDate && (
            <span className={`flex min-w-0 items-center gap-1.5 ${dueDateTone}`}>
              <CalendarDays size={14} className="shrink-0" />
              <span className="max-w-24 truncate font-medium" title={dueDate}>
                {dueDate}
              </span>
            </span>
          )}

          {task.client && (
            <span className="flex min-w-0 items-center gap-1.5">
              <Building2 size={14} className="shrink-0" />
              <span className="max-w-32 truncate" title={task.client.name}>
                {task.client.name}
              </span>
            </span>
          )}

          {visibleAssignees.length > 0 && (
            <span className="flex min-w-0 items-center gap-1.5">
              <UserRound size={14} className="shrink-0" />
              <span
                className="flex -space-x-1"
                title={task.assignees
                  .map(
                    (assignee) =>
                      assignee.name || assignee.email || "Usuário"
                  )
                  .join(", ")}
              >
                {visibleAssignees.map((assignee) => (
                  <span
                    key={assignee.id}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 ring-2 ring-white"
                  >
                    {(assignee.name || assignee.email || "U")
                      .slice(0, 1)
                      .toUpperCase()}
                  </span>
                ))}
                {extraAssigneesCount > 0 && (
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-1 text-[10px] font-semibold text-slate-600 ring-2 ring-white">
                    +{extraAssigneesCount}
                  </span>
                )}
              </span>
            </span>
          )}
        </div>
      )}
    </article>
  );
}

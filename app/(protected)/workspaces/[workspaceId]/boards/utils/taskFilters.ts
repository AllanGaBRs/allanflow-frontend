import type { TasksByColumn } from "../hooks/useTasksByColumn";
import type { Task, TaskPriority } from "../types/task";

export type BoardTaskFilters = {
  search: string;
  priority: "" | TaskPriority;
  assigneeId: string;
  labelId: string;
  clientId: string;
};

export const emptyBoardTaskFilters: BoardTaskFilters = {
  search: "",
  priority: "",
  assigneeId: "",
  labelId: "",
  clientId: "",
};

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

function taskMatchesFilters(task: Task, filters: BoardTaskFilters) {
  const titleSearch = normalizeText(filters.search);

  return (
    (!titleSearch || normalizeText(task.title).includes(titleSearch)) &&
    (!filters.priority || task.priority === filters.priority) &&
    (!filters.assigneeId ||
      task.assignees.some((assignee) => assignee.id === filters.assigneeId)) &&
    (!filters.labelId ||
      task.labels.some((label) => label.id === filters.labelId)) &&
    (!filters.clientId || task.client?.id === filters.clientId)
  );
}

export function filterTasksByColumn(
  tasksByColumn: TasksByColumn,
  filters: BoardTaskFilters
): TasksByColumn {
  return Object.fromEntries(
    Object.entries(tasksByColumn).map(([columnId, tasks]) => [
      columnId,
      tasks.filter((task) => taskMatchesFilters(task, filters)),
    ])
  );
}

export function hasActiveBoardTaskFilters(filters: BoardTaskFilters) {
  return (
    filters.search.trim() !== "" ||
    filters.priority !== "" ||
    filters.assigneeId !== "" ||
    filters.labelId !== "" ||
    filters.clientId !== ""
  );
}

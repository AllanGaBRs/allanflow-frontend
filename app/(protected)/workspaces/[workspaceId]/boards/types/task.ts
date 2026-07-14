export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskLabel = {
  id: string;
  name: string;
  color?: string | null;
};

export type TaskAssignee = {
  id: string;
  name?: string | null;
  email?: string | null;
};

export type TaskClient = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  columnId: string;
  columnName: string;
  boardId: string;
  boardName: string;
  position: number;
  priority: TaskPriority;
  archived: boolean;
  dueDate: string | null;
  labels: TaskLabel[];
  assignees: TaskAssignee[];
  client: TaskClient | null;
};

export type TaskMovePayload = {
  targetColumnId: string;
  targetPosition?: number | null;
};

export type TaskUpdatePayload = {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string | null;
  labels: string[];
  assignees: string[];
  client: string | null;
};

export type TaskForm = {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  labelIds: string[];
  assigneeIds: string[];
  clientId: string;
};

export type DashboardSummary = {
  boards: number;
  activeTasks: number;
  overdueTasks: number;
  members: number;
};

export type TasksByPriority = {
  low: number;
  medium: number;
  high: number;
};

export type Dashboard = {
  summary: DashboardSummary;
  tasksByPriority: TasksByPriority;
};

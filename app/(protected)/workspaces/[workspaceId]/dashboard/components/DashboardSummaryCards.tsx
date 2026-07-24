import {
  AlertTriangle,
  CheckSquare2,
  Kanban,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { DashboardSummary } from "../types/dashboard";

type DashboardSummaryCardsProps = {
  summary: DashboardSummary;
};

type SummaryCard = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
};

export function DashboardSummaryCards({
  summary,
}: DashboardSummaryCardsProps) {
  const cards: SummaryCard[] = [
    {
      label: "Boards",
      value: summary.boards,
      icon: Kanban,
      iconClassName: "bg-blue-50 text-blue-600",
    },
    {
      label: "Tarefas ativas",
      value: summary.activeTasks,
      icon: CheckSquare2,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Tarefas atrasadas",
      value: summary.overdueTasks,
      icon: AlertTriangle,
      iconClassName: "bg-amber-50 text-amber-600",
    },
    {
      label: "Membros",
      value: summary.members,
      icon: Users,
      iconClassName: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, iconClassName }) => (
        <article
          key={label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                {value}
              </p>
            </div>

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
            >
              <Icon size={21} aria-hidden="true" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

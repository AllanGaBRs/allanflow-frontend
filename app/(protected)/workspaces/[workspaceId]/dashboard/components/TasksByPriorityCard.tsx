import type { TasksByPriority } from "../types/dashboard";

type TasksByPriorityCardProps = {
  tasksByPriority: TasksByPriority;
};

export function TasksByPriorityCard({
  tasksByPriority,
}: TasksByPriorityCardProps) {
  const total =
    tasksByPriority.low + tasksByPriority.medium + tasksByPriority.high;
  const priorities = [
    {
      label: "Baixa",
      value: tasksByPriority.low,
      barClassName: "bg-emerald-500",
    },
    {
      label: "Média",
      value: tasksByPriority.medium,
      barClassName: "bg-amber-500",
    },
    {
      label: "Alta",
      value: tasksByPriority.high,
      barClassName: "bg-red-500",
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-slate-950">
          Tarefas por prioridade
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Distribuição das tarefas ativas do workspace.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {priorities.map(({ label, value, barClassName }) => {
          const percentage = total === 0 ? 0 : (value / total) * 100;

          return (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="font-semibold text-slate-950">{value}</span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label={`Prioridade ${label}`}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={value}
              >
                <div
                  className={`h-full rounded-full ${barClassName}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

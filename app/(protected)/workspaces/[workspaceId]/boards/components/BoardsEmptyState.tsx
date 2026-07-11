import { Kanban } from "lucide-react";

type BoardsEmptyStateProps = {
  title: string;
  description: string;
  centered?: boolean;
};

export function BoardsEmptyState({
  title,
  description,
  centered = false,
}: BoardsEmptyStateProps) {
  const Element = centered ? "div" : "section";

  return (
    <Element
      className={
        centered
          ? "flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center"
          : "rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center"
      }
    >
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Kanban size={28} />
        </div>

        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </Element>
  );
}

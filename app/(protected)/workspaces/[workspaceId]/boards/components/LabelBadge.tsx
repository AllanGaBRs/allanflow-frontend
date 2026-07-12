import type { Label } from "../types/label";

type LabelBadgeProps = {
  label: Label;
};

export function LabelBadge({ label }: LabelBadgeProps) {
  return (
    <span className="inline-flex min-h-8 max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700">
      <span
        className="h-3 w-3 shrink-0 rounded-full border border-slate-200"
        style={{ backgroundColor: label.color }}
        aria-hidden="true"
      />
      <span className="truncate">{label.name}</span>
    </span>
  );
}

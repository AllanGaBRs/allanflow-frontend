import { ArrowLeft, ArrowRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Column } from "../types/board";

type ColumnCardProps = {
  column: Column;
  index: number;
  totalColumns: number;
  loading: boolean;
  onMove: (columnId: string, direction: "left" | "right") => void;
  onEdit: (column: Column) => void;
  onDelete: (column: Column) => void;
};

export function ColumnCard({
  column,
  index,
  totalColumns,
  loading,
  onMove,
  onEdit,
  onDelete,
}: ColumnCardProps) {
  return (
    <article className="flex min-h-[calc(100vh-15rem)] w-[320px] shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">
            {column.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Posição {column.position}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(column.id, "left")}
            disabled={loading || index === 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Mover coluna para esquerda"
          >
            <ArrowLeft size={15} />
          </button>

          <button
            type="button"
            onClick={() => onMove(column.id, "right")}
            disabled={loading || index === totalColumns - 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Mover coluna para direita"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
        Nenhuma tarefa nesta coluna
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onEdit(column)}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Pencil size={16} />
          Editar
        </button>

        <button
          type="button"
          onClick={() => onDelete(column)}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={16} />
          Excluir
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center text-slate-400">
        <MoreHorizontal size={18} />
      </div>
    </article>
  );
}

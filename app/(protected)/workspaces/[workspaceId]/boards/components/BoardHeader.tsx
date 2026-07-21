"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Board } from "../types/board";

type BoardHeaderProps = {
  board: Board;
};

export function BoardHeader({ board }: BoardHeaderProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <button
        type="button"
        onClick={() => setCollapsed((current) => !current)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
        aria-expanded={!collapsed}
        aria-controls="board-header-description"
        aria-label={
          collapsed
            ? "Expandir cabeçalho do board"
            : "Minimizar cabeçalho do board"
        }
      >
        {collapsed ? (
          <ChevronRight size={15} />
        ) : (
          <ChevronDown size={15} />
        )}
      </button>

      <div className="min-w-0">
        <h2 className="truncate text-xl font-semibold text-slate-950">
          {board.name}
        </h2>
        <p
          id="board-header-description"
          hidden={collapsed}
          className="mt-1 line-clamp-1 max-w-3xl text-sm leading-6 text-slate-500"
        >
          {board.description || "Board selecionado"}
        </p>
      </div>
    </div>
  );
}

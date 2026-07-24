export function DashboardLoading() {
  return (
    <div className="space-y-6" aria-label="Carregando indicadores">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm"
          />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
    </div>
  );
}

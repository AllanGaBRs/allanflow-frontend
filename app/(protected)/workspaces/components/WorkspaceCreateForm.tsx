type Props = {
  name: string;
  loading: boolean;
  onNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function WorkspaceCreateForm({
  name,
  loading,
  onNameChange,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
        Criar novo
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nome do workspace"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          minLength={2}
          maxLength={120}
          required
        />

        <button
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          +
        </button>
      </div>
    </form>
  );
}
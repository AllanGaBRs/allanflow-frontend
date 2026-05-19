type Props = {
  name: string;
  loading: boolean;
  onNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function WorkspaceCreateForm({
  name,
  loading,
  onNameChange,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label
        htmlFor="workspace-name"
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        Nome do workspace
      </label>

      <div className="space-y-4">
        <input
          id="workspace-name"
          type="text"
          placeholder="Nome do workspace"
          className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          minLength={2}
          maxLength={120}
          required
          autoFocus
        />

        <button
          type="submit"
          disabled={loading}
          className="min-h-11 w-full rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar"}
        </button>
      </div>
    </form>
  );
}

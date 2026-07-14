"use client";

import type { ClientCreatePayload } from "../types/client";

type ClientFormProps = {
  form: ClientCreatePayload;
  loading: boolean;
  onChange: <K extends keyof ClientCreatePayload>(
    field: K,
    value: ClientCreatePayload[K]
  ) => void;
  onSubmit: () => Promise<boolean>;
  submitLabel?: string;
};

export function ClientForm({
  form,
  loading,
  onChange,
  onSubmit,
  submitLabel = "Criar cliente",
}: ClientFormProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="client-name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nome
        </label>
        <input
          id="client-name"
          type="text"
          value={form.name}
          onChange={(event) => onChange("name", event.target.value)}
          disabled={loading}
          className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Nome do cliente"
          required
        />
      </div>

      <div>
        <label
          htmlFor="client-email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="client-email"
          type="email"
          value={form.email}
          onChange={(event) => onChange("email", event.target.value)}
          disabled={loading}
          className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="cliente@email.com"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="client-phone"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Telefone
          </label>
          <input
            id="client-phone"
            type="tel"
            value={form.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            disabled={loading}
            className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label
            htmlFor="client-company"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Empresa
          </label>
          <input
            id="client-company"
            type="text"
            value={form.company}
            onChange={(event) => onChange("company", event.target.value)}
            disabled={loading}
            className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            placeholder="Empresa"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}

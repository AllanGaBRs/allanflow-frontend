"use client";

import { X } from "lucide-react";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import { useNotifications } from "@/components/notifications/NotificationsProvider";
import { useChangePassword } from "../hooks/useChangePassword";

type ChangePasswordModalProps = {
  onClose: () => void;
};

export function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const { notify } = useNotifications();
  const {
    form,
    loading,
    error,
    updateForm,
    resetForm,
    changePassword,
  } = useChangePassword();

  useToastMessage(error, { title: "Erro ao alterar senha" });

  function closeModal() {
    if (loading) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const saved = await changePassword();

    if (saved) {
      notify({
        title: "Senha atualizada",
        message: "Senha alterada com sucesso.",
        variant: "success",
      });
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="change-password-title"
              className="text-lg font-semibold text-slate-950"
            >
              Mudar senha
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Atualize a senha usada para acessar sua conta.
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Senha atual
            </label>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={(event) =>
                updateForm("currentPassword", event.target.value)
              }
              disabled={loading}
              required
              autoFocus
              className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Nova senha
            </label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              minLength={6}
              maxLength={100}
              value={form.newPassword}
              onChange={(event) =>
                updateForm("newPassword", event.target.value)
              }
              disabled={loading}
              required
              className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="password-confirmation"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Confirmar nova senha
            </label>
            <PasswordInput
              id="password-confirmation"
              autoComplete="new-password"
              minLength={6}
              maxLength={100}
              value={form.passwordConfirmation}
              onChange={(event) =>
                updateForm("passwordConfirmation", event.target.value)
              }
              disabled={loading}
              required
              className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Alterando..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

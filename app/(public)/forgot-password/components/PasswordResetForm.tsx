"use client";

import Link from "next/link";
import { useState } from "react";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import { usePasswordReset } from "../hooks/usePasswordReset";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-blue-500";

export function PasswordResetForm() {
  const {
    email,
    error,
    loading,
    requestCode,
    resetPassword,
    restart,
    step,
  } = usePasswordReset();
  const [requestEmail, setRequestEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [validationError, setValidationError] = useState("");
  useToastMessage(validationError, {
    variant: "warning",
    title: "Validação",
  });
  useToastMessage(error, { title: "Erro na recuperação" });

  async function handleRequestSubmit(event: React.FormEvent) {
    event.preventDefault();
    await requestCode(requestEmail);
  }

  async function handleResetSubmit(event: React.FormEvent) {
    event.preventDefault();
    setValidationError("");

    if (newPassword !== passwordConfirmation) {
      setValidationError("As senhas não coincidem.");
      return;
    }

    await resetPassword(code, newPassword);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020B1F] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl">
        {step === "request" && (
          <>
            <header className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white">Recuperar senha</h1>
              <p className="mt-2 text-sm text-white/50">
                Informe seu e-mail para receber o código de recuperação.
              </p>
            </header>

            <form onSubmit={handleRequestSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="reset-email" className="mb-2 block text-sm text-white/70">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="seuemail@email.com"
                  className={inputClassName}
                  value={requestEmail}
                  onChange={(event) => setRequestEmail(event.target.value)}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <header className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white">Crie uma nova senha</h1>
              <p className="mt-2 text-sm text-white/50">
                Se existir uma conta para <span className="text-white/70">{email}</span>,
                o código chegará por e-mail e será válido por 10 minutos.
              </p>
            </header>

            <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="reset-code" className="mb-2 block text-sm text-white/70">
                  Código de 7 caracteres
                </label>
                <input
                  id="reset-code"
                  type="text"
                  inputMode="text"
                  autoComplete="one-time-code"
                  placeholder="ABCD234"
                  className={`${inputClassName} uppercase tracking-[0.25em]`}
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\s/g, "").toUpperCase())
                  }
                  minLength={7}
                  maxLength={7}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="new-password" className="mb-2 block text-sm text-white/70">
                  Nova senha
                </label>
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  placeholder="Mínimo de 6 caracteres"
                  className={inputClassName}
                  iconClassName="text-white/40 hover:bg-white/10 hover:text-white/80"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password-confirmation"
                  className="mb-2 block text-sm text-white/70"
                >
                  Confirme a nova senha
                </label>
                <PasswordInput
                  id="password-confirmation"
                  autoComplete="new-password"
                  placeholder="Digite a senha novamente"
                  className={inputClassName}
                  iconClassName="text-white/40 hover:bg-white/10 hover:text-white/80"
                  value={passwordConfirmation}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 7}
                className="mt-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Redefinindo..." : "Redefinir senha"}
              </button>

              <button
                type="button"
                onClick={restart}
                disabled={loading}
                className="text-sm text-blue-400 hover:underline disabled:opacity-50"
              >
                Corrigir e-mail ou solicitar outro código
              </button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Senha redefinida</h1>
            <p role="status" className="mt-3 text-sm text-white/60">
              Sua senha foi alterada. Você já pode entrar com os novos dados.
            </p>
            <Link
              href="/login"
              className="mt-6 block rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Ir para o login
            </Link>
          </div>
        )}

        {step !== "success" && (
          <p className="mt-6 text-center text-sm text-white/50">
            Lembrou sua senha?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Voltar ao login
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

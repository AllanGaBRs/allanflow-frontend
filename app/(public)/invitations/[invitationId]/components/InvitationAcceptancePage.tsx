"use client";

import Link from "next/link";
import { useState } from "react";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import { useInvitation } from "../hooks/useInvitation";

type Props = {
  invitationId: string;
};

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-blue-500";

const roleLabels = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Membro",
} as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export function InvitationAcceptancePage({ invitationId }: Props) {
  const {
    invitation,
    invitationLoading,
    session,
    sessionLoading,
    submitting,
    error,
    sessionError,
    acceptInvitation,
  } = useInvitation(invitationId);
  const [code, setCode] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await acceptInvitation(code);
  }

  const isReady = !invitationLoading && !sessionLoading && invitation;
  const isLoggedIn = Boolean(session);
  const loginHref = `/login?next=/invitations/${invitationId}`;
  useToastMessage(sessionError, { variant: "warning", title: "Sessão" });
  useToastMessage(error, { title: "Convite" });
  useToastMessage(
    isReady && !isLoggedIn
      ? "Faça login com a conta convidada para aceitar o convite."
      : "",
    { variant: "warning", title: "Sessão necessária" }
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020B1F] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl">
        {invitationLoading && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Carregando convite</h1>
            <p className="mt-3 text-sm text-white/60">
              Estamos conferindo os detalhes do seu convite.
            </p>
          </div>
        )}

        {isReady && invitation && (
          <>
            <header className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white">Aceitar convite</h1>
              <p className="mt-2 text-sm text-white/50">
                Você foi convidado para entrar no workspace abaixo.
              </p>
            </header>

            <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
              <p className="font-semibold text-white">{invitation.workspaceName}</p>
              <p className="mt-1">
                Convidado por <span className="text-white">{invitation.invitedByName}</span>
              </p>
              <p className="mt-1">
                Papel: <span className="text-white">{roleLabels[invitation.role]}</span>
              </p>
              <p className="mt-1">
                Expira em <span className="text-white">{formatDate(invitation.expiresAt)}</span>
              </p>
            </div>

            {sessionLoading ? (
              <p className="mb-4 text-sm text-white/50">Verificando sua sessão...</p>
            ) : isLoggedIn ? (
              <p className="mb-4 text-sm text-white/50">
                Logado como <span className="text-white">{session?.email}</span>.
              </p>
            ) : (
              <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white/[0.03] px-3 py-3 text-sm text-white/70">
                <p>Você precisa entrar com a conta convidada para continuar.</p>
                <Link href={loginHref} className="text-blue-400 underline">
                  Ir para o login
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="invite-code" className="mb-2 block text-sm text-white/70">
                  Código do convite
                </label>
                <input
                  id="invite-code"
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="text"
                  placeholder="ABCD234"
                  className={`${inputClassName} uppercase tracking-[0.25em]`}
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\s/g, "").toUpperCase())
                  }
                  minLength={7}
                  maxLength={7}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !isLoggedIn || code.length !== 7}
                className="rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Aceitando..." : "Aceitar convite"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/50">
              Depois de aceitar, você será redirecionado para seus workspaces.
            </p>
          </>
        )}

        {!invitationLoading && !invitation && error && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Convite indisponível</h1>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={loginHref}
                className="rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Entrar com outra conta
              </Link>
              <Link href="/workspaces" className="text-sm text-blue-400 hover:underline">
                Ir para meus workspaces
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

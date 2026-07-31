"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import { useLogin } from "../hooks/useLogin";
import { AuthShell } from "../../components/AuthShell";
import { GoogleOAuthButton } from "../../components/GoogleOAuthButton";

type LoginFormProps = {
  googleOAuthUrl: string;
};

const inputClassName =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export function LoginForm({ googleOAuthUrl }: LoginFormProps) {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? undefined;
  const { login, loading, error } = useLogin(nextPath);
  useToastMessage(error, { title: "Erro no login" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <AuthShell
      title="Entrar na sua conta"
      description="Acesse seus workspaces, boards e tarefas."
    >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="seuemail@email.com"
              className={inputClassName}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Senha
            </label>
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              className={inputClassName}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="mt-2 text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em]">
            ou
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleOAuthButton
          href={googleOAuthUrl}
          label="Continuar com Google"
        />

        <p className="mt-6 text-center text-sm text-slate-500">
          Não tem conta?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Criar conta
          </Link>
        </p>
    </AuthShell>
  );
}

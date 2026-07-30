"use client";

import Link from "next/link";
import { useState } from "react";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import { useRegister } from "../hooks/useRegister";
import { AuthShell } from "../../components/AuthShell";
import { GoogleOAuthButton } from "../../components/GoogleOAuthButton";

type RegisterFormProps = {
  googleOAuthUrl: string;
};

const inputClassName =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export function RegisterForm({ googleOAuthUrl }: RegisterFormProps) {
  const { register, loading, error } = useRegister();
  useToastMessage(error, { title: "Erro ao criar conta" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await register(name, email, password);
  }

  return (
    <AuthShell
      title="Criar sua conta"
      description="Comece organizando seus workspaces e boards."
    >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="register-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nome
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              className={inputClassName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="register-email"
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
              htmlFor="register-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Senha
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Digite sua senha"
              className={inputClassName}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Criar conta"}
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
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Entrar
          </Link>
        </p>
    </AuthShell>
  );
}

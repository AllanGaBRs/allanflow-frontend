"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { GoogleOAuthButton } from "../../components/GoogleOAuthButton";

type LoginFormProps = {
  googleOAuthUrl: string;
};

export function LoginForm({ googleOAuthUrl }: LoginFormProps) {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? undefined;
  const { login, loading, error } = useLogin(nextPath);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020B1F] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Login</h1>
          <p className="mt-2 text-sm text-white/50">
            Entre para acessar seus workspaces
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">Email</label>
            <input
              type="email"
              placeholder="seuemail@email.com"
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="mt-2 text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-white/30">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.3em]">ou</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <GoogleOAuthButton
          href={googleOAuthUrl}
          label="Continuar com Google"
        />

        <p className="mt-6 text-center text-sm text-white/50">
          Não tem conta?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

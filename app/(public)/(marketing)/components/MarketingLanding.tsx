"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ComponentType } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Kanban,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Recursos", href: "#recursos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Segurança", href: "#seguranca" },
];

const features = [
  {
    title: "Boards e tarefas",
    description:
      "Veja o trabalho em colunas, com prioridade, prazo e status sem esforço.",
    icon: Kanban,
  },
  {
    title: "Colaboração",
    description:
      "Centralize responsáveis, comentários, checklists e convites no mesmo fluxo.",
    icon: Users,
  },
  {
    title: "Controle de acesso",
    description:
      "Separe workspaces e defina permissões OWNER, ADMIN e MEMBER com clareza.",
    icon: ShieldCheck,
  },
];

const steps = [
  "Crie sua conta",
  "Monte seu workspace",
  "Organize boards e tarefas",
  "Convide sua equipe",
];

const trustPoints = [
  "Autenticação segura",
  "Recuperação de senha",
  "Permissões por função",
  "Convites por e-mail",
];

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
        <Icon size={20} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

export function MarketingLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="scroll-smooth overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8 lg:px-10 xl:gap-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="#inicio" className="inline-flex items-center">
              <Image
                src="/img/AllanFlow_FullLogo.png"
                alt="AllanFlow"
                width={960}
                height={281}
                priority
                className="block h-auto w-36 max-w-none object-contain sm:w-48 lg:w-60 xl:w-[17.5rem]"
              />
            </Link>
          </div>

          <nav
            aria-label="Navegação principal"
            className="hidden flex-1 items-center justify-center gap-2 xl:flex"
          >
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-transparent px-4 py-2 text-sm text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex whitespace-nowrap rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:px-4"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:px-5 sm:py-2.5"
            >
              Criar conta
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 xl:hidden"
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <div
            id="mobile-menu"
            className={`w-full overflow-hidden transition-all duration-200 xl:hidden ${
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <nav
              aria-label="Navegação principal mobile"
              className="mt-2 grid gap-2 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main id="inicio">
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-8 lg:px-10 lg:pt-20">
          <div className="max-w-3xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              <Check size={15} className="text-sky-700" />
              <span className="truncate">Organize trabalho com mais clareza</span>
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              AllanFlow centraliza tarefas, equipes e workspaces em um só lugar.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Uma plataforma colaborativa para boards Kanban, comentários,
              checklists, clientes, permissões e convites. Tudo pensado para
              equipes que querem menos ruído e mais visão do trabalho.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Começar agora
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Entrar na plataforma
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-sm text-slate-600">
              {[
                "Boards Kanban",
                "Workspaces",
                "Permissões por função",
                "Convites por e-mail",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="recursos"
          className="mx-auto max-w-7xl px-4 pb-16 sm:px-8 lg:px-10"
        >
          <SectionTitle
            eyebrow="Recursos"
            title="Tudo que sua equipe precisa para acompanhar o trabalho."
            description="Organize tarefas em boards, conecte clientes aos workspaces e mantenha comentários, checklists e responsáveis sempre no contexto certo."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section
          id="como-funciona"
          className="mx-auto max-w-7xl px-4 pb-16 sm:px-8 lg:px-10"
        >
          <SectionTitle
            eyebrow="Como funciona"
            title="Entrar e começar leva poucos passos."
            description="Crie um workspace, estruture os boards por fluxo de trabalho e convide as pessoas certas para colaborar com clareza."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-base font-semibold text-slate-950">
                  {step}
                </h3>
              </article>
            ))}
          </div>
        </section>

        <section
          id="seguranca"
          className="mx-auto max-w-7xl px-4 pb-20 sm:px-8 lg:px-10"
        >
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionTitle
                eyebrow="Segurança"
                title="O básico bem feito: acesso, função e isolamento."
                description="Cada workspace mantém seus dados separados, com autenticação, recuperação de senha e permissões por função para controlar quem pode gerenciar cada área."
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <CheckCircle2 size={18} className="text-sky-700" />
                    <p className="text-sm font-medium text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 lg:px-10">
          <div className="rounded-4xl border border-slate-200 bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                  Pronto para usar
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Crie sua conta e comece a organizar o trabalho hoje.
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Acesse a plataforma, monte seu workspace e convide sua equipe
                  sem complicar o início.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Criar conta
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Entrar na plataforma
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-8 lg:px-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-xl">
            <Image
              src="/img/AllanFlow_FullLogo.png"
              alt="AllanFlow"
              width={960}
              height={281}
              className="block h-auto w-60 max-w-none object-contain"
            />
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Plataforma colaborativa de gerenciamento de tarefas para equipes
              que precisam de organização, visibilidade e controle.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4 py-8 text-slate-900 sm:px-6">
      <section className="w-full max-w-md">
        <div className="mb-4 flex justify-center">
          <Image
            src="/img/AllanFlow_FullLogo.png"
            alt="AllanFlow"
            width={960}
            height={281}
            priority
            className="h-auto w-72 object-contain"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </header>

          {children}
        </div>
      </section>
    </main>
  );
}

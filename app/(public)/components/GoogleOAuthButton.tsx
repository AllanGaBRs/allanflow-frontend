"use client";

type GoogleOAuthButtonProps = {
  href: string;
  label: string;
};

export function GoogleOAuthButton({ href, label }: GoogleOAuthButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020B1F]"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#111827]">
        G
      </span>
      <span>{label}</span>
    </a>
  );
}

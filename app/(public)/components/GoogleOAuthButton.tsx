"use client";

type GoogleOAuthButtonProps = {
  href: string;
  label: string;
};

export function GoogleOAuthButton({ href, label }: GoogleOAuthButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-900">
        G
      </span>
      <span>{label}</span>
    </a>
  );
}

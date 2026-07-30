"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  email: string;
};

function getFirstName(email: string) {
  const localPart = email.split("@")[0] || "";
  const firstToken = localPart.split(/[._-\s]+/)[0] || localPart;

  if (!firstToken) {
    return "?";
  }

  return firstToken.charAt(0).toUpperCase() + firstToken.slice(1);
}

export function UserMenu({ email }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const firstName = getFirstName(email);
  const initial = firstName.charAt(0).toUpperCase() || "?";

  function toggle() {
    setOpen((prev) => !prev);
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        title={firstName}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b px-4 py-3 text-sm text-slate-600">
            {firstName}
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

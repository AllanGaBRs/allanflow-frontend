"use client";

import { useState, useRef, useEffect } from "react";
import { KeyRound, LogOut } from "lucide-react";
import { ChangePasswordModal } from "../../account/components/ChangePasswordModal";

type Props = {
  name?: string;
  email: string;
};

function getDisplayName(name: string | undefined, email: string) {
  const trimmedName = name?.trim();

  if (trimmedName) {
    return trimmedName.split(/\s+/)[0];
  }

  const localPart = email.split("@")[0] || "";
  const firstToken = localPart.split(/[._-\s]+/)[0] || localPart;

  if (!firstToken) {
    return "?";
  }

  return firstToken.charAt(0).toUpperCase() + firstToken.slice(1);
}

export function UserMenu({ name, email }: Props) {
  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = getDisplayName(name, email);
  const initial = displayName.charAt(0).toUpperCase() || "?";

  function toggle() {
    setOpen((prev) => !prev);
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  function openChangePassword() {
    setOpen(false);
    setChangePasswordOpen(true);
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
        title={displayName}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b px-4 py-3 text-sm text-slate-600">
            {displayName}
          </div>

          <button
            type="button"
            onClick={openChangePassword}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <KeyRound size={16} />
            <span>Mudar senha</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      )}

      {changePasswordOpen && (
        <ChangePasswordModal onClose={() => setChangePasswordOpen(false)} />
      )}
    </div>
  );
}

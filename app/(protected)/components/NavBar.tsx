"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

type NavBarProps = {
  collapsed: boolean;
  onToggle: () => void;
  variant?: "default" | "workspaces";
  workspaceId?: string;
  workspaceRole?: "OWNER" | "ADMIN" | "MEMBER";
};

export function NavBar({
  collapsed,
  onToggle,
  variant = "default",
  workspaceId,
  workspaceRole,
}: NavBarProps) {
  const canManageMembers =
    workspaceRole === "OWNER" || workspaceRole === "ADMIN";
  const defaultMenuItems = [
    {
      label: "Dashboard",
      href: "/workspaces",
      icon: LayoutDashboard,
    },
    {
      label: "Workspaces",
      href: "/workspaces",
      icon: FolderKanban,
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: Settings,
    },
  ];
  const workspaceMenuItems =
    workspaceId && canManageMembers
      ? [
          ...defaultMenuItems.slice(0, 2),
          {
            label: "Membros",
            href: `/workspaces/${workspaceId}/members`,
            icon: Users,
          },
          defaultMenuItems[2],
        ]
      : defaultMenuItems;
  const workspacesMenuItems = defaultMenuItems.filter(
    (item) => item.label !== "Dashboard"
  );
  const menuItems =
    variant === "workspaces" ? workspacesMenuItems : workspaceMenuItems;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r border-white/10 bg-[#1F2A3D] text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex h-24 items-center justify-center overflow-hidden border-b border-white/10 px-3">
        {!collapsed ? (
          <img
            src="/img/AllanFlow.png"
            alt="AllanFlow"
            className="pointer-events-none block max-h-80 w-[300px] object-contain"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold">
            AF
          </div>
        )}
      </div>

      <div className="px-3 py-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <div className="flex items-center gap-2">
              <PanelLeftClose size={18} />
              <span>Minimizar</span>
            </div>
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <Icon size={20} />

              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

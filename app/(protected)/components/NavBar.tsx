"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FolderKanban,
  Kanban,
  Settings,
  Tags,
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
      href: workspaceId ? `/workspaces/${workspaceId}` : "/workspaces",
      icon: LayoutDashboard,
    },
    {
      label: "Workspaces",
      href: "/workspaces",
      icon: FolderKanban,
    },
    {
      label: "Boards",
      href: workspaceId ? `/workspaces/${workspaceId}/boards` : "/workspaces",
      icon: Kanban,
    },
    {
      label: "Labels",
      href: workspaceId ? `/workspaces/${workspaceId}/labels` : "/workspaces",
      icon: Tags,
    },
    {
      label: "Clientes",
      href: workspaceId ? `/workspaces/${workspaceId}/clients` : "/workspaces",
      icon: BriefcaseBusiness,
    },
    {
      label: "Configurações",
      href: workspaceId ? `/workspaces/${workspaceId}/settings` : "/settings",
      icon: Settings,
    },
  ];
  const workspaceMenuItems =
    workspaceId && canManageMembers
      ? [
          defaultMenuItems[0],
          defaultMenuItems[2],
          defaultMenuItems[3],
          defaultMenuItems[4],
          {
            label: "Membros",
            href: `/workspaces/${workspaceId}/members`,
            icon: Users,
          },
          defaultMenuItems[5],
        ]
      : workspaceId
        ? [defaultMenuItems[2], defaultMenuItems[3], defaultMenuItems[4]]
        : defaultMenuItems;
  const workspacesMenuItems = defaultMenuItems.filter(
    (item) => item.label === "Workspaces"
  );
  const menuItems =
    variant === "workspaces" ? workspacesMenuItems : workspaceMenuItems;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-[#1F2A3D] text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex h-24 items-center justify-center overflow-hidden border-b border-white/10 px-3">
        <img
          src="/img/AllanFlow.png"
          alt="AllanFlow"
          className={`pointer-events-none block object-contain transition-all duration-300 ${
            collapsed ? "w-44 max-w-none" : "w-87.5"
          }`}
        />
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

      {workspaceId && variant !== "workspaces" && (
        <div className="mt-auto px-3 py-4">
          <Link
            href="/workspaces"
            title={collapsed ? "Workspaces" : undefined}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <FolderKanban size={18} />
            {!collapsed && <span>Workspaces</span>}
          </Link>
        </div>
      )}
    </aside>
  );
}

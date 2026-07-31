"use client";

import {
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AIAssistant } from "../../components/AIAssistant";
import { NavBar } from "../../components/NavBar";
import { WorkspaceHeader } from "./WorkspaceHeader";

type Props = {
  children: ReactNode;
  navVariant?: "default" | "workspaces";
  workspaceId?: string;
  workspaceRole?: "OWNER" | "ADMIN" | "MEMBER";
  headerTitle?: string;
  headerSubtitle?: string;
};

const SIDEBAR_STORAGE_KEY = "allanflow-sidebar-collapsed";

export function WorkspaceLayout({
  children,
  navVariant = "default",
  workspaceId,
  workspaceRole,
  headerTitle,
  headerSubtitle,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  const animationFrameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const savedValue = localStorage.getItem(SIDEBAR_STORAGE_KEY);

    const restoreFrameId = requestAnimationFrame(() => {
      setCollapsed(savedValue === "true");

      animationFrameRef.current = requestAnimationFrame(() => {
        setAnimationsEnabled(true);
      });
    });

    return () => {
      cancelAnimationFrame(restoreFrameId);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  function handleToggle() {
    setCollapsed((previousValue) => {
      const nextValue = !previousValue;

      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(nextValue)
      );

      return nextValue;
    });
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <NavBar
        collapsed={collapsed}
        variant={navVariant}
        workspaceId={workspaceId}
        workspaceRole={workspaceRole}
        onToggle={handleToggle}
        animated={animationsEnabled}
      />

      <main
        className={`flex min-h-screen min-w-0 flex-col overflow-x-hidden ${
          animationsEnabled ? "transition-[padding] duration-300" : ""
        } ${collapsed ? "pl-20" : "pl-64"}`}
      >
        <WorkspaceHeader
          title={headerTitle}
          subtitle={headerSubtitle}
        />

        <div className="flex min-w-0 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}
import type { Metadata } from "next";

import { MarketingLanding } from "./components/MarketingLanding";

export const metadata: Metadata = {
  title: "AllanFlow | Organize tarefas, times e workspaces",
  description:
    "AllanFlow centraliza workspaces, boards Kanban, tarefas, comentários, checklists, permissões e convites em uma plataforma colaborativa para equipes.",
  openGraph: {
    title: "AllanFlow | Organize tarefas, times e workspaces",
    description:
      "Uma plataforma colaborativa para gerenciar tarefas, workspaces, boards e equipes com clareza.",
    type: "website",
  },
};

export default function MarketingPage() {
  return <MarketingLanding />;
}

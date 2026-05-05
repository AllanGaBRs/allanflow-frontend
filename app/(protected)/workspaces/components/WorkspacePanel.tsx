import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function WorkspacePanel({ children }: Props) {
  return (
    <section className="w-[430px] border-r border-slate-200 bg-white p-5">
      {children}
    </section>
  );
}
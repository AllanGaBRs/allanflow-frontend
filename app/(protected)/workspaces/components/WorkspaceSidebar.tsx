import Link from "next/link";

export function WorkspaceSidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1F2A3D] text-white">
            <div className="flex h-32 items-center justify-center overflow-hidden">
                <img
                    src="/AllanFlow.png"
                    alt="AllanFlow"
                    className="h-full scale-150 object-contain"
                />
            </div>
            <nav className="mt-4 flex flex-col gap-1 px-3">
                <Link
                    href="/workspaces"
                    className="rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold"
                >
                    Dashboard
                </Link>

                {["Workspaces", "Configurações"].map((item) => (
                    <span
                        key={item}
                        className="rounded-lg px-4 py-3 text-sm text-white/70 hover:bg-white/10"
                    >
                        {item}
                    </span>
                ))}
            </nav>
        </aside>
    );
}
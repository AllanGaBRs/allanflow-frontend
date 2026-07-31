export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900 font-sans">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.92),rgba(247,248,252,1))]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

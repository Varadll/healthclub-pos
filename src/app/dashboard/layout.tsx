import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      {/* Main content — offset by sidebar width on desktop, offset by mobile header on mobile */}
      <main className="lg:ml-[260px] pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}

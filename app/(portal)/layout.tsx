import Sidebar from "@/components/dashboard/sidebar";
import AuthGuard from "@/components/auth/auth-guard";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
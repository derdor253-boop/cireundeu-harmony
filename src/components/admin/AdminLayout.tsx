import { Outlet, Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLayout() {
  const { user, fullName } = useAdminAuth();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-cream-deep/40">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-3 sm:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1.5 text-sm text-forest hover:underline sm:inline-flex"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Lihat Website
              </Link>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="hidden text-right sm:block">
                <p className="font-medium text-foreground leading-tight">{fullName || "Admin"}</p>
                <p className="text-xs text-muted-foreground leading-tight">{user?.email}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-cream font-medium">
                {(fullName || user?.email || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

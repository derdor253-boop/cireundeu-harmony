import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, user, isAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-forest" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream p-6 text-center">
        <h1 className="font-display text-2xl text-forest">Akses Ditolak</h1>
        <p className="max-w-md text-muted-foreground">
          Akun Anda belum memiliki izin sebagai operator. Hubungi administrator utama untuk meminta akses.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

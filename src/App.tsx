import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminKelolaBeranda from "@/pages/admin/KelolaBeranda";
import AdminKelolaPaket from "@/pages/admin/KelolaPaket";
import AdminGaleri from "@/pages/admin/Galeri";
import AdminArtikel from "@/pages/admin/Artikel";
import AdminProfilKampung from "@/pages/admin/ProfilKampung";
import AdminKontak from "@/pages/admin/Kontak";
import AdminBukuSaku from "@/pages/admin/BukuSaku";
import AdminPengaturan from "@/pages/admin/Pengaturan";
import AdminKuliner from "@/pages/admin/Kuliner";
import AdminPengguna from "@/pages/admin/Pengguna";

// Fix: jika user membuka URL langsung seperti /admin/login (tanpa hash),
// arahkan ke bentuk hash router sebelum HashRouter mount.
if (typeof window !== "undefined") {
  const p = window.location.pathname;
  if (p !== "/" && !window.location.hash) {
    window.history.replaceState(null, "", "/#" + p + window.location.search);
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="beranda" element={<AdminKelolaBeranda />} />
            <Route path="profil" element={<AdminProfilKampung />} />
            <Route path="kuliner" element={<AdminKuliner />} />
            <Route path="wisata" element={<AdminKelolaPaket />} />
            <Route path="kontak" element={<AdminKontak />} />
            <Route path="pengguna" element={<AdminPengguna />} />
            <Route path="buku-saku" element={<AdminBukuSaku />} />

            {/* Rute tambahan (tetap dapat diakses via URL) */}
            <Route path="galeri" element={<AdminGaleri />} />
            <Route path="artikel" element={<AdminArtikel />} />
            <Route path="pengaturan" element={<AdminPengaturan />} />

            {/* Alias lama agar tidak rusak */}
            <Route path="profil-kampung" element={<Navigate to="/admin/profil" replace />} />
            <Route path="paket" element={<Navigate to="/admin/wisata" replace />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

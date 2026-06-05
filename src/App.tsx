import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteContentProvider } from "@/hooks/useSiteContent";
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
import AdminKonten from "@/pages/admin/Konten";
import AdminTombolLink from "@/pages/admin/TombolLink";
import AdminWhatsapp from "@/pages/admin/Whatsapp";
import AdminLogoMedia from "@/pages/admin/LogoMedia";
import AdminNavigasi from "@/pages/admin/Navigasi";

if (typeof window !== "undefined") {
  const p = window.location.pathname;
  if (p !== "/" && !window.location.hash) {
    window.history.replaceState(null, "", "/#" + p + window.location.search);
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SiteContentProvider>
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
              <Route path="konten" element={<AdminKonten />} />
              <Route path="tombol-link" element={<AdminTombolLink />} />
              <Route path="whatsapp" element={<AdminWhatsapp />} />
              <Route path="logo-media" element={<AdminLogoMedia />} />
              <Route path="navigasi" element={<AdminNavigasi />} />
              <Route path="pengguna" element={<AdminPengguna />} />
              <Route path="pengaturan" element={<AdminPengaturan />} />

              <Route path="profil" element={<AdminProfilKampung />} />
              <Route path="kuliner" element={<AdminKuliner />} />
              <Route path="wisata" element={<AdminKelolaPaket />} />
              <Route path="kontak" element={<AdminKontak />} />
              <Route path="buku-saku" element={<AdminBukuSaku />} />
              <Route path="galeri" element={<AdminGaleri />} />
              <Route path="artikel" element={<AdminArtikel />} />

              <Route path="profil-kampung" element={<Navigate to="/admin/profil" replace />} />
              <Route path="paket" element={<Navigate to="/admin/wisata" replace />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </SiteContentProvider>
  </QueryClientProvider>
);

export default App;

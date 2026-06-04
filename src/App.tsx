import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
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
import AdminProduk from "@/pages/admin/Produk";
import AdminGaleri from "@/pages/admin/Galeri";
import AdminArtikel from "@/pages/admin/Artikel";
import AdminProfilKampung from "@/pages/admin/ProfilKampung";
import AdminKontak from "@/pages/admin/Kontak";
import AdminBukuSaku from "@/pages/admin/BukuSaku";
import AdminPengaturan from "@/pages/admin/Pengaturan";


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
            <Route path="profil-kampung" element={<AdminProfilKampung />} />
            <Route path="paket" element={<AdminKelolaPaket />} />
            <Route path="galeri" element={<AdminGaleri />} />
            <Route path="produk" element={<AdminProduk />} />
            <Route path="artikel" element={<AdminArtikel />} />
            <Route path="kontak" element={<AdminKontak />} />
            <Route path="buku-saku" element={<AdminBukuSaku />} />
            <Route path="pengaturan" element={<AdminPengaturan />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Images, Newspaper, CheckCircle2, Globe, Clock, BookOpen, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/admin/StatCard";
import PageHeader from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function Dashboard() {
  const { fullName, user } = useAdminAuth();
  const [stats, setStats] = useState({ products: 0, photos: 0, articles: 0, lastUpdated: "—" });

  useEffect(() => {
    (async () => {
      const [p, g, a, lastP] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("gallery_photos").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("products").select("updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      const lastUpdated = lastP.data?.updated_at
        ? new Date(lastP.data.updated_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Belum ada perubahan";
      setStats({
        products: p.count ?? 0,
        photos: g.count ?? 0,
        articles: a.count ?? 0,
        lastUpdated,
      });
    })();
  }, []);

  const domain =
    typeof window !== "undefined" ? window.location.hostname : "cireundeu.lovable.app";

  const shortcuts = [
    { to: "/admin/beranda", label: "Edit Beranda", desc: "Ubah headline & hero halaman utama" },
    { to: "/admin/kuliner", label: "Kelola Kuliner", desc: "Tambah/ubah kuliner khas" },
    { to: "/admin/wisata", label: "Kelola Paket Wisata", desc: "Atur paket & harga kunjungan" },
    { to: "/admin/galeri", label: "Unggah Foto Galeri", desc: "Tambahkan dokumentasi visual" },
    { to: "/admin/whatsapp", label: "Atur WhatsApp", desc: "Nomor & template pesan" },
    { to: "/admin/buku-saku", label: "Buku Saku Admin", desc: "Panduan penggunaan dasbor" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={`Selamat datang, ${fullName || user?.email?.split("@")[0] || "Operator"} 👋`}
        description="Ringkasan kondisi website Kampung Adat Cireundeu hari ini."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Jumlah Produk" value={stats.products} icon={Package} tone="forest" />
        <StatCard label="Jumlah Foto Galeri" value={stats.photos} icon={Images} tone="terracotta" />
        <StatCard label="Jumlah Artikel" value={stats.articles} icon={Newspaper} tone="gold" />
        <StatCard label="Status Website" value="Aktif" icon={CheckCircle2} hint="Online & dapat diakses" tone="forest" />
        <StatCard label="Domain Website" value={domain} icon={Globe} tone="muted" />
        <StatCard label="Terakhir Diperbarui" value={stats.lastUpdated} icon={Clock} tone="muted" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg text-forest">Pintasan Cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {shortcuts.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 p-4 transition hover:border-forest hover:bg-muted"
              >
                <div>
                  <p className="font-medium text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-forest" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-forest text-cream shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <BookOpen className="h-5 w-5" /> Baru pertama kali?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-cream/90">
            <p>
              Buka <strong>Buku Saku Admin</strong> untuk memahami cara mengelola website, istilah domain, dan
              panduan keamanan akun.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/admin/buku-saku">Buka Buku Saku</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/admin/PageHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";

type Village = {
  id: number;
  name: string;
  short_description: string | null;
  history: string | null;
  cultural_values: string | null;
  local_uniqueness: string | null;
  hero_image_url: string | null;
  address: string | null;
};

type AboutData = { title: string; body: string };
type HistoryData = { title: string; body: string };

export default function ProfilKampungPage() {
  const [village, setVillage] = useState<Village | null>(null);
  const [about, setAbout] = useState<AboutData>({ title: "", body: "" });
  const [history, setHistory] = useState<HistoryData>({ title: "", body: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: v }, { data: a }, { data: h }] = await Promise.all([
        supabase.from("village_profile").select("*").eq("id", 1).maybeSingle(),
        supabase.from("site_content").select("data").eq("key", "about").maybeSingle(),
        supabase.from("site_content").select("data").eq("key", "history").maybeSingle(),
      ]);
      if (v) setVillage(v as Village);
      if (a?.data) setAbout(a.data as AboutData);
      if (h?.data) setHistory(h.data as HistoryData);
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!village) return;
    setSaving(true);
    const [vErr, aErr, hErr] = await Promise.all([
      supabase
        .from("village_profile")
        .update({
          name: village.name,
          short_description: village.short_description,
          history: village.history,
          cultural_values: village.cultural_values,
          local_uniqueness: village.local_uniqueness,
          hero_image_url: village.hero_image_url,
          address: village.address,
        })
        .eq("id", 1)
        .then((r) => r.error),
      supabase
        .from("site_content")
        .upsert({ key: "about", data: about as any }, { onConflict: "key" })
        .then((r) => r.error),
      supabase
        .from("site_content")
        .upsert({ key: "history", data: history as any }, { onConflict: "key" })
        .then((r) => r.error),
    ]);
    setSaving(false);
    const err = vErr || aErr || hErr;
    if (err) toast.error("Gagal menyimpan: " + err.message);
    else toast.success("Profil & Sejarah berhasil diperbarui");
  };

  if (!village) return <p className="p-6 text-muted-foreground">Memuat…</p>;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Kelola Profil & Sejarah"
        description="Edit narasi yang muncul di seksi 'Tentang Kami' dan 'Sejarah & Profil Adat' di halaman depan."
      />
      <form onSubmit={save} className="space-y-6">
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Tentang Kami</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Judul Seksi</Label>
              <Input value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Narasi</Label>
              <Textarea rows={6} value={about.body} onChange={(e) => setAbout({ ...about, body: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Sejarah & Profil Adat Cireundeu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Judul Seksi</Label>
              <Input value={history.title} onChange={(e) => setHistory({ ...history, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Narasi Sejarah</Label>
              <Textarea
                rows={8}
                value={history.body}
                onChange={(e) => setHistory({ ...history, body: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Data Tambahan Kampung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nilai Budaya</Label>
              <Textarea
                rows={3}
                value={village.cultural_values ?? ""}
                onChange={(e) => setVillage({ ...village, cultural_values: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Keunikan Lokal</Label>
              <Textarea
                rows={3}
                value={village.local_uniqueness ?? ""}
                onChange={(e) => setVillage({ ...village, local_uniqueness: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Alamat / Lokasi</Label>
              <Input
                value={village.address ?? ""}
                onChange={(e) => setVillage({ ...village, address: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Foto Utama Profil</Label>
              <ImageUpload
                value={village.hero_image_url}
                onChange={(p) => setVillage({ ...village, hero_image_url: p })}
                folder="profil"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving} className="bg-forest hover:bg-forest-light">
          <Save className="h-4 w-4" /> {saving ? "Menyimpan…" : "Simpan Semua Perubahan"}
        </Button>
      </form>
    </div>
  );
}

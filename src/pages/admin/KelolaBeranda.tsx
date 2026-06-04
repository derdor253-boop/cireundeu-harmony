import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/admin/PageHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";

type HeroData = { headline: string; subheadline: string; hero_image_url: string };

const empty: HeroData = { headline: "", subheadline: "", hero_image_url: "" };

export default function KelolaBeranda() {
  const [form, setForm] = useState<HeroData>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("data")
        .eq("key", "hero")
        .maybeSingle();
      if (data?.data) setForm({ ...empty, ...(data.data as HeroData) });
      setLoading(false);
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "hero", data: form as any }, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error("Gagal menyimpan: " + error.message);
    else toast.success("Beranda berhasil diperbarui. Halaman publik akan otomatis menampilkan perubahan.");
  };

  if (loading) return <p className="p-6 text-muted-foreground">Memuat…</p>;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Kelola Beranda"
        description="Atur teks utama (headline) dan gambar latar di bagian Hero halaman depan."
      />
      <Card className="border-border shadow-card">
        <CardContent className="p-6">
          <form onSubmit={save} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Headline (Wilujeng Sumping…)</Label>
              <Input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="Wilujeng Sumping di Kampung Adat Cireundeu"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Sub-headline</Label>
              <Textarea
                rows={3}
                value={form.subheadline}
                onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
                placeholder="1–2 kalimat yang menggambarkan kampung"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Gambar Latar Hero (opsional)</Label>
              <ImageUpload
                value={form.hero_image_url || null}
                onChange={(p) => setForm({ ...form, hero_image_url: p ?? "" })}
                folder="hero"
              />
              <p className="text-xs text-muted-foreground">
                Kosongkan jika ingin tetap memakai gambar latar default.
              </p>
            </div>
            <Button type="submit" disabled={saving} className="bg-forest hover:bg-forest-light">
              <Save className="h-4 w-4" /> {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

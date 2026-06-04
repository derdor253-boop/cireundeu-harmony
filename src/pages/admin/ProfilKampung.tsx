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

export default function ProfilKampungPage() {
  const [data, setData] = useState<Village | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("village_profile")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setData((data as Village) ?? null));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    const { error } = await supabase.from("village_profile").update({
      name: data.name,
      short_description: data.short_description,
      history: data.history,
      cultural_values: data.cultural_values,
      local_uniqueness: data.local_uniqueness,
      hero_image_url: data.hero_image_url,
      address: data.address,
    }).eq("id", 1);
    setSaving(false);
    if (error) toast.error("Gagal menyimpan");
    else toast.success("Profil kampung diperbarui");
  };

  if (!data) return <p className="p-6 text-muted-foreground">Memuat…</p>;

  const field = (k: keyof Village, label: string, rows = 3) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea
        rows={rows}
        value={(data[k] as string) ?? ""}
        onChange={(e) => setData({ ...data, [k]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Profil Kampung"
        description="Informasi umum Kampung Adat Cireundeu yang ditampilkan di website."
      />
      <Card className="border-border shadow-card">
        <CardContent className="p-6">
          <form onSubmit={save} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Nama Kampung</Label>
              <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            </div>
            {field("short_description", "Deskripsi Singkat", 2)}
            {field("history", "Sejarah Singkat", 5)}
            {field("cultural_values", "Nilai Budaya", 4)}
            {field("local_uniqueness", "Keunikan Lokal", 4)}
            <div className="space-y-1.5">
              <Label>Alamat / Lokasi</Label>
              <Input value={data.address ?? ""} onChange={(e) => setData({ ...data, address: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Foto Utama Profil</Label>
              <ImageUpload
                value={data.hero_image_url}
                onChange={(p) => setData({ ...data, hero_image_url: p })}
                folder="profil"
              />
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

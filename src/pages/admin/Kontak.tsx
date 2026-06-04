import { useEffect, useState } from "react";
import { Save, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/admin/PageHeader";
import { toast } from "sonner";

type Contact = {
  id: number;
  whatsapp: string | null;
  instagram: string | null;
  email: string | null;
  address: string | null;
  maps_url: string | null;
  hours: string | null;
};

export default function KontakPage() {
  const [data, setData] = useState<Contact | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("site_contact")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setData((data as Contact) ?? null));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    const { error } = await supabase.from("site_contact").update({
      whatsapp: data.whatsapp,
      instagram: data.instagram,
      email: data.email,
      address: data.address,
      maps_url: data.maps_url,
      hours: data.hours,
    }).eq("id", 1);
    setSaving(false);
    if (error) toast.error("Gagal menyimpan");
    else toast.success("Kontak berhasil diperbarui");
  };

  if (!data) return <p className="p-6 text-muted-foreground">Memuat…</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Kontak & Media Sosial" description="Informasi kontak yang muncul di halaman utama website." />

      <div className="mb-5 flex items-start gap-2 rounded-md border border-gold/40 bg-gold/10 p-3 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
        <p>Data ini akan ditampilkan di footer dan halaman kontak website utama.</p>
      </div>

      <Card className="border-border shadow-card">
        <CardContent className="p-6">
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nomor WhatsApp</Label>
                <Input
                  value={data.whatsapp ?? ""}
                  onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Instagram</Label>
                <Input
                  value={data.instagram ?? ""}
                  onChange={(e) => setData({ ...data, instagram: e.target.value })}
                  placeholder="@kampungcireundeu"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={data.email ?? ""}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="info@cireundeu.id"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Jam Operasional / Kunjungan</Label>
                <Input
                  value={data.hours ?? ""}
                  onChange={(e) => setData({ ...data, hours: e.target.value })}
                  placeholder="Senin–Minggu, 08.00–17.00"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Alamat</Label>
              <Textarea
                rows={2}
                value={data.address ?? ""}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Link Google Maps</Label>
              <Input
                value={data.maps_url ?? ""}
                onChange={(e) => setData({ ...data, maps_url: e.target.value })}
                placeholder="https://maps.google.com/…"
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

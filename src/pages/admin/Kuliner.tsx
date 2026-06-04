import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";

type Item = {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
};

const empty = (): Item => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  price: "",
  image_url: "",
});

export default function Kuliner() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("data")
        .eq("key", "kuliner")
        .maybeSingle();
      const list = (data?.data as any)?.items as Item[] | undefined;
      setItems(list?.length ? list : []);
      setLoading(false);
    })();
  }, []);

  const update = (id: string, patch: Partial<Item>) =>
    setItems((arr) => arr.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const remove = (id: string) => setItems((arr) => arr.filter((it) => it.id !== id));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "kuliner", data: { items } as any }, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error("Gagal menyimpan: " + error.message);
    else toast.success("Kuliner Khas berhasil diperbarui.");
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 p-6 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Memuat…
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Kelola Kuliner Khas"
        description="Atur daftar makanan & minuman khas Cireundeu yang ditampilkan di halaman publik."
      />

      <div className="mb-4 flex justify-end">
        <Button onClick={() => setItems((a) => [...a, empty()])} variant="outline">
          <Plus className="h-4 w-4" /> Tambah Kuliner
        </Button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Belum ada kuliner. Klik "Tambah Kuliner" untuk mulai.
          </p>
        )}
        {items.map((it, idx) => (
          <Card key={it.id} className="border-border shadow-card">
            <CardContent className="grid gap-4 p-5 md:grid-cols-[160px_1fr_auto]">
              <div>
                <Label className="mb-1.5 block text-xs">Foto</Label>
                <ImageUpload
                  value={it.image_url || null}
                  onChange={(p) => update(it.id, { image_url: p ?? "" })}
                  folder="kuliner"
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Nama Kuliner #{idx + 1}</Label>
                  <Input
                    value={it.name}
                    onChange={(e) => update(it.id, { name: e.target.value })}
                    placeholder="Mis. Rasi (nasi singkong)"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Harga (opsional)</Label>
                    <Input
                      value={it.price}
                      onChange={(e) => update(it.id, { price: e.target.value })}
                      placeholder="Rp 15.000"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Deskripsi</Label>
                  <Textarea
                    rows={2}
                    value={it.description}
                    onChange={(e) => update(it.id, { description: e.target.value })}
                    placeholder="Cerita singkat tentang kuliner ini…"
                  />
                </div>
              </div>
              <div className="flex items-start">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => remove(it.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving} className="bg-forest hover:bg-forest-light">
          <Save className="h-4 w-4" /> {saving ? "Menyimpan…" : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}

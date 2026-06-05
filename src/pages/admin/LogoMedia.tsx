import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { uploadImage } from "@/lib/storage";

type MA = {
  id: string;
  slot: string;
  name: string;
  image_url: string | null;
  link_url: string | null;
  target: string;
  active: boolean;
  sort_order: number;
};

const SLOTS = [
  { key: "partners", label: "Logo Mitra (Navbar)" },
  { key: "social", label: "Ikon Media Sosial Tambahan" },
];

export default function LogoMediaPage() {
  const [slot, setSlot] = useState(SLOTS[0].key);
  const [items, setItems] = useState<MA[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase
      .from("media_assets")
      .select("*")
      .eq("slot", slot)
      .order("sort_order", { ascending: true });
    const list = (data as any) ?? [];
    setItems(list);
    setLoaded(true);
    const map: Record<string, string> = {};
    await Promise.all(
      list.map(async (i: MA) => {
        const u = await resolveMediaUrl(i.image_url);
        if (u) map[i.id] = u;
      }),
    );
    setPreviews(map);
  };

  useEffect(() => {
    setLoaded(false);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot]);

  const update = (id: string, patch: Partial<MA>) =>
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const saveOne = async (it: MA) => {
    const { error } = await supabase
      .from("media_assets")
      .update({
        name: it.name,
        image_url: it.image_url,
        link_url: it.link_url,
        target: it.target,
        active: it.active,
        sort_order: it.sort_order,
      })
      .eq("id", it.id);
    if (error) toast.error(error.message);
    else toast.success("Tersimpan");
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Dihapus");
    load();
  };

  const add = async () => {
    const { error } = await supabase.from("media_assets").insert({
      slot,
      name: "Item baru",
      image_url: "",
      link_url: "",
      target: "_blank",
      active: true,
      sort_order: items.length + 1,
    });
    if (error) toast.error(error.message);
    else load();
  };

  const upload = async (it: MA, file: File) => {
    try {
      const path = await uploadImage(file, `media/${slot}`);
      update(it.id, { image_url: path });
      const url = await resolveMediaUrl(path);
      if (url) setPreviews((p) => ({ ...p, [it.id]: url }));
      toast.success("Gambar diunggah. Klik Simpan untuk mempersist.");
    } catch (e: any) {
      toast.error(e.message ?? "Gagal mengunggah");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logo & Media"
        description="Kelola logo mitra, ikon klikable, dan media lain yang muncul di website."
      />

      <div className="flex flex-wrap gap-2">
        {SLOTS.map((s) => (
          <Button
            key={s.key}
            variant={slot === s.key ? "default" : "outline"}
            onClick={() => setSlot(s.key)}
            className={slot === s.key ? "bg-forest text-cream hover:bg-forest-light" : ""}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {!loaded ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Memuat…
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <Card key={it.id} className="border-border">
              <CardContent className="grid gap-3 pt-6 sm:grid-cols-[120px_1fr_auto]">
                <div className="flex items-center justify-center rounded-md border border-dashed border-border bg-muted/40 p-2 h-24">
                  {previews[it.id] ? (
                    <img src={previews[it.id]} alt={it.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Tanpa gambar</span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <Label>Nama</Label>
                      <Input value={it.name} onChange={(e) => update(it.id, { name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Link Tujuan (opsional)</Label>
                      <Input value={it.link_url ?? ""} onChange={(e) => update(it.id, { link_url: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>URL Gambar (atau unggah di kanan)</Label>
                      <Input
                        value={it.image_url ?? ""}
                        onChange={(e) => update(it.id, { image_url: e.target.value })}
                        placeholder="https://… atau path storage"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={it.active} onCheckedChange={(v) => update(it.id, { active: v })} />
                      <Label className="text-xs">Aktif</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={it.target === "_blank"}
                        onCheckedChange={(v) => update(it.id, { target: v ? "_blank" : "_self" })}
                      />
                      <Label className="text-xs">Tab baru</Label>
                    </div>
                    <Input
                      type="number"
                      className="w-20"
                      value={it.sort_order}
                      onChange={(e) => update(it.id, { sort_order: parseInt(e.target.value) || 0 })}
                    />
                    <Label className="text-xs">Urutan</Label>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && upload(it, e.target.files[0])}
                    />
                    <span className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs hover:bg-accent">
                      <Upload className="h-3.5 w-3.5" /> Unggah
                    </span>
                  </label>
                  <Button size="sm" onClick={() => saveOne(it)} className="bg-forest hover:bg-forest-light text-cream">
                    <Save className="mr-1 h-3.5 w-3.5" /> Simpan
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(it.id)}>
                    <Trash2 className="mr-1 h-3.5 w-3.5 text-destructive" /> Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={add}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Item
          </Button>
        </div>
      )}
    </div>
  );
}

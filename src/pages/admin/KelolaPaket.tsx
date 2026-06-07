import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package as PackageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { getSignedUrl } from "@/lib/storage";
import { toast } from "sonner";

function PkgImage({ path, alt }: { path: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    getSignedUrl(path).then(setUrl);
  }, [path]);
  return (
    <div className="aspect-video w-full bg-muted">
      {url && <img src={url} alt={alt} className="h-full w-full object-cover" />}
    </div>
  );
}

type Pkg = {
  id: string;
  name: string;
  duration: string | null;
  price: string | null;
  description: string | null;
  features: string[];
  sort_order: number;
  active: boolean;
  image_url: string | null;
};

const empty = {
  name: "",
  duration: "",
  price: "",
  description: "",
  featuresText: "",
  sort_order: 0,
  active: true,
  image_url: "",
};

export default function KelolaPaket() {
  const [list, setList] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [form, setForm] = useState(empty);
  const [toDelete, setToDelete] = useState<Pkg | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tour_packages")
      .select("*")
      .order("sort_order", { ascending: true });
    const items = (data ?? []).map((d: any) => ({
      ...d,
      features: Array.isArray(d.features) ? d.features : [],
    })) as Pkg[];
    setList(items);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("tour_packages_admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "tour_packages" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...empty, sort_order: list.length });
    setOpen(true);
  };
  const openEdit = (p: Pkg) => {
    setEditing(p);
    setForm({
      name: p.name,
      duration: p.duration ?? "",
      price: p.price ?? "",
      description: p.description ?? "",
      featuresText: p.features.join("\n"),
      sort_order: p.sort_order,
      active: p.active,
      image_url: p.image_url ?? "",
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Nama paket wajib diisi");
      return;
    }
    const features = form.featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      name: form.name.trim(),
      duration: form.duration || null,
      price: form.price || null,
      description: form.description || null,
      features: features as any,
      sort_order: form.sort_order,
      active: form.active,
      image_url: form.image_url || null,
    };
    const { error } = editing
      ? await supabase.from("tour_packages").update(payload).eq("id", editing.id)
      : await supabase.from("tour_packages").insert(payload);
    if (error) {
      toast.error("Gagal menyimpan: " + error.message);
      return;
    }
    toast.success(editing ? "Paket diperbarui" : "Paket ditambahkan");
    setOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await supabase.from("tour_packages").delete().eq("id", toDelete.id);
    toast.success("Paket dihapus");
    setToDelete(null);
    load();
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Kelola Paket Wisata"
        description="Atur daftar paket kunjungan, harga, dan fasilitas yang tampil di halaman depan."
        actions={
          <Button onClick={openCreate} className="bg-forest hover:bg-forest-light">
            <Plus className="h-4 w-4" /> Tambah Paket
          </Button>
        }
      />

      {loading ? (
        <p className="py-10 text-center text-muted-foreground">Memuat…</p>
      ) : list.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            Belum ada paket. Klik <strong>Tambah Paket</strong>.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Card key={p.id} className="overflow-hidden border-border shadow-card">
              {p.image_url && <PkgImage path={p.image_url} alt={p.name} />}
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg text-forest">{p.name}</h3>
                    {p.duration && <p className="text-xs text-muted-foreground">{p.duration}</p>}
                  </div>
                  <Badge variant={p.active ? "default" : "secondary"}>
                    {p.active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                {p.price && <p className="font-semibold text-terracotta">{p.price}</p>}
                {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                {p.features.length > 0 && (
                  <ul className="space-y-1 text-sm">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <PackageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex justify-end gap-1 pt-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setToDelete(p)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Paket" : "Tambah Paket"}</DialogTitle>
            <DialogDescription>Atur detail paket kunjungan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nama Paket *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Paket Setengah Hari"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Durasi</Label>
                <Input
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="3-4 jam"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Harga</Label>
                <Input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Rp 75.000 / orang"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Deskripsi Singkat</Label>
              <Textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Daftar Fasilitas (satu per baris)</Label>
              <Textarea
                rows={5}
                value={form.featuresText}
                onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                placeholder={"Welcome drink\nTur kampung\nCicip rasi\nPemandu lokal"}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Urutan Tampilan</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-end gap-2">
                <Switch
                  checked={form.active}
                  onCheckedChange={(v) => setForm({ ...form, active: v })}
                />
                <Label className="cursor-pointer">Tampilkan di website</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-forest hover:bg-forest-light">
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
            <div className="space-y-1.5">
              <Label>Foto Paket / Aktivitas</Label>
              <ImageUpload
                value={form.image_url || null}
                onChange={(p) => setForm({ ...form, image_url: p ?? "" })}
                folder="wisata"
              />
            </div>
            
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        onConfirm={confirmDelete}
        title={`Hapus paket "${toDelete?.name}"?`}
      />
    </div>
  );
}

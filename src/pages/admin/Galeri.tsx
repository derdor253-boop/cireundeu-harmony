import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { getSignedUrl } from "@/lib/storage";

type Photo = {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  image_url: string;
};

const CATS = ["Produk", "Kegiatan", "Budaya", "Lingkungan", "Lainnya"];
const empty = { title: "", caption: "", category: "Kegiatan", image_url: "" };

function PhotoCard({ p, onEdit, onDelete }: { p: Photo; onEdit: () => void; onDelete: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    getSignedUrl(p.image_url).then(setUrl);
  }, [p.image_url]);
  return (
    <Card className="overflow-hidden border-border shadow-card">
      <div className="aspect-square w-full bg-muted">
        {url && <img src={url} alt={p.title} className="h-full w-full object-cover" />}
      </div>
      <CardContent className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-sm font-medium">{p.title}</p>
          <Badge variant="outline" className="shrink-0 text-xs">
            {p.category}
          </Badge>
        </div>
        {p.caption && <p className="line-clamp-2 text-xs text-muted-foreground">{p.caption}</p>}
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GaleriPage() {
  const [list, setList] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Photo | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("gallery_photos").select("*").order("created_at", { ascending: false });
    setList((data as Photo[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (p: Photo) => {
    setEditing(p);
    setForm({ title: p.title, caption: p.caption ?? "", category: p.category, image_url: p.image_url });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image_url) {
      toast.error("Judul dan foto wajib diisi");
      return;
    }
    const { error } = editing
      ? await supabase.from("gallery_photos").update(form).eq("id", editing.id)
      : await supabase.from("gallery_photos").insert(form);
    if (error) {
      toast.error("Gagal menyimpan");
      return;
    }
    toast.success(editing ? "Foto diperbarui" : "Foto berhasil diunggah");
    setOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await supabase.from("gallery_photos").delete().eq("id", toDelete.id);
    toast.success("Foto dihapus");
    setToDelete(null);
    load();
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Galeri Foto"
        description="Kelola dokumentasi visual kegiatan, budaya, dan keindahan kampung."
        actions={
          <Button onClick={openCreate} className="bg-forest hover:bg-forest-light">
            <Plus className="h-4 w-4" /> Tambah Foto
          </Button>
        }
      />

      <div className="mb-5 flex items-start gap-2 rounded-md border border-gold/40 bg-gold/10 p-3 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
        <p>
          <strong>Panduan singkat:</strong> Gunakan foto yang jelas, terang, tidak blur, dan menampilkan objek
          utama dengan baik.
        </p>
      </div>

      {loading ? (
        <p className="py-10 text-center text-muted-foreground">Memuat…</p>
      ) : list.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            Belum ada foto. Klik <strong>Tambah Foto</strong> untuk mulai mengunggah.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <PhotoCard key={p.id} p={p} onEdit={() => openEdit(p)} onDelete={() => setToDelete(p)} />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Foto" : "Tambah Foto"}</DialogTitle>
            <DialogDescription>Beri judul yang jelas agar mudah dicari.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Judul *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Keterangan</Label>
              <Textarea
                rows={3}
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Foto *</Label>
              <ImageUpload
                value={form.image_url || null}
                onChange={(p) => setForm({ ...form, image_url: p ?? "" })}
                folder="galeri"
              />
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

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        onConfirm={confirmDelete}
        title={`Hapus foto "${toDelete?.title}"?`}
      />
    </div>
  );
}

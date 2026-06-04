import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { getSignedUrl } from "@/lib/storage";

type Article = {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  image_url: string | null;
  category: string;
  publish_date: string;
  author: string | null;
  status: string;
};

const CATS = ["Berita", "Budaya", "Kegiatan KKN", "Profil Warga", "Lainnya"];
const today = () => new Date().toISOString().slice(0, 10);
const empty: Omit<Article, "id"> = {
  title: "",
  summary: "",
  body: "",
  image_url: null,
  category: "Berita",
  publish_date: today(),
  author: "",
  status: "draft",
};

export default function ArtikelPage() {
  const [list, setList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Article | null>(null);
  const [preview, setPreview] = useState<{ a: Article; img: string | null } | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("articles").select("*").order("publish_date", { ascending: false });
    setList((data as Article[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Judul artikel wajib diisi");
      return;
    }
    const { error } = editing
      ? await supabase.from("articles").update(form).eq("id", editing.id)
      : await supabase.from("articles").insert(form);
    if (error) {
      toast.error("Gagal menyimpan");
      return;
    }
    toast.success(editing ? "Artikel diperbarui" : "Artikel disimpan");
    setOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await supabase.from("articles").delete().eq("id", toDelete.id);
    toast.success("Artikel dihapus");
    setToDelete(null);
    load();
  };

  const showPreview = async (a: Article) => {
    const img = await getSignedUrl(a.image_url);
    setPreview({ a, img });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Artikel & Berita"
        description="Cerita budaya, kegiatan KKN, profil warga, dan kabar terbaru dari kampung."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setForm({ ...empty, publish_date: today() });
              setOpen(true);
            }}
            className="bg-forest hover:bg-forest-light"
          >
            <Plus className="h-4 w-4" /> Tambah Artikel
          </Button>
        }
      />

      <Card className="border-border shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead className="hidden md:table-cell">Kategori</TableHead>
                <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Memuat…
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Belum ada artikel.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{a.category}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {new Date(a.publish_date).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.status === "published" ? "default" : "secondary"}>
                        {a.status === "published" ? "Dipublikasikan" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => showPreview(a)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditing(a);
                            setForm({ ...a });
                            setOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setToDelete(a)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Artikel" : "Tambah Artikel"}</DialogTitle>
            <DialogDescription>Tulis artikel yang ringkas dan mudah dibaca warga.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Judul *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={form.publish_date}
                  onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Dipublikasikan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Ringkasan</Label>
              <Textarea
                rows={2}
                value={form.summary ?? ""}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="1–2 kalimat singkat tentang isi artikel"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Isi Artikel</Label>
              <Textarea
                rows={8}
                value={form.body ?? ""}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Penulis</Label>
              <Input value={form.author ?? ""} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Foto Utama</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(p) => setForm({ ...form, image_url: p })}
                folder="artikel"
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

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{preview?.a.title}</DialogTitle>
            <DialogDescription>
              {preview?.a.category} · {preview && new Date(preview.a.publish_date).toLocaleDateString("id-ID")}
              {preview?.a.author && ` · ${preview.a.author}`}
            </DialogDescription>
          </DialogHeader>
          {preview?.img && (
            <img src={preview.img} alt="" className="aspect-video w-full rounded-md object-cover" />
          )}
          {preview?.a.summary && <p className="text-sm italic text-muted-foreground">{preview.a.summary}</p>}
          <p className="whitespace-pre-wrap text-sm">{preview?.a.body || "Belum ada isi."}</p>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        onConfirm={confirmDelete}
        title={`Hapus artikel "${toDelete?.title}"?`}
      />
    </div>
  );
}

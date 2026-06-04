import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  published: boolean;
};

const empty = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_url: null as string | null,
  published: false,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

export default function ArtikelPage() {
  const [list, setList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Article | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    setList((data as Article[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      cover_url: form.cover_url,
      published: form.published,
    };
    const { error } = editing
      ? await supabase.from("articles").update(payload).eq("id", editing.id)
      : await supabase.from("articles").insert(payload);
    if (error) {
      toast.error("Gagal menyimpan: " + error.message);
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

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Artikel & Berita"
        description="Cerita budaya, kegiatan, dan kabar terbaru dari kampung."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setForm(empty);
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                    Memuat…
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                    Belum ada artikel.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell>
                      <Badge variant={a.published ? "default" : "secondary"}>
                        {a.published ? "Publik" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditing(a);
                            setForm({
                              title: a.title,
                              slug: a.slug ?? "",
                              excerpt: a.excerpt ?? "",
                              content: a.content ?? "",
                              cover_url: a.cover_url,
                              published: a.published,
                            });
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
            <DialogDescription>Tulis singkat dan jelas.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Judul *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label>Ringkasan</Label>
              <Textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Isi Artikel</Label>
              <Textarea
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Foto Utama</Label>
              <ImageUpload
                value={form.cover_url}
                onChange={(p) => setForm({ ...form, cover_url: p })}
                folder="artikel"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <Label className="cursor-pointer">Publikasikan ke website</Label>
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
        title={`Hapus artikel "${toDelete?.title}"?`}
      />
    </div>
  );
}

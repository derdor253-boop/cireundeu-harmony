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

type Product = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: string | null;
  maker: string | null;
  image_url: string | null;
  whatsapp: string | null;
  status: string;
};

const CATEGORIES = ["Batik", "Kerajinan", "Kuliner", "Lainnya"];

const empty: Omit<Product, "id"> = {
  name: "",
  category: "Kuliner",
  description: "",
  price: "",
  maker: "",
  image_url: null,
  whatsapp: "",
  status: "draft",
};

export default function ProdukPage() {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<{ p: Product; img: string | null } | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Gagal memuat data produk");
    setList((data as Product[]) ?? []);
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
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    const payload = { ...form, name: form.name.trim() };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) {
      toast.error("Gagal menyimpan: " + error.message);
      return;
    }
    toast.success(editing ? "Produk diperbarui" : "Produk berhasil ditambahkan");
    setOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", toDelete.id);
    if (error) toast.error("Gagal menghapus");
    else toast.success("Produk dihapus");
    setToDelete(null);
    load();
  };

  const showPreview = async (p: Product) => {
    const img = await getSignedUrl(p.image_url);
    setPreview({ p, img });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Manajemen Produk Lokal"
        description="Kelola katalog produk UMKM Kampung Adat Cireundeu — batik, kerajinan, dan kuliner."
        actions={
          <Button onClick={openCreate} className="bg-forest hover:bg-forest-light">
            <Plus className="h-4 w-4" /> Tambah Produk
          </Button>
        }
      />

      <Card className="border-border shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead className="hidden sm:table-cell">Kategori</TableHead>
                <TableHead className="hidden md:table-cell">Pembuat</TableHead>
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
                    Belum ada produk. Klik <strong>Tambah Produk</strong> untuk mulai.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{p.category}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{p.maker || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "published" ? "default" : "secondary"}>
                        {p.status === "published" ? "Dipublikasikan" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => showPreview(p)} title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(p)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setToDelete(p)}
                          title="Hapus"
                          className="text-destructive hover:text-destructive"
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

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
            <DialogDescription>Lengkapi informasi produk dengan benar.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nama Produk *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Label>Deskripsi</Label>
              <Textarea
                rows={4}
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Jelaskan keunikan, bahan, dan kegunaan produk…"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Harga (opsional)</Label>
                <Input
                  value={form.price ?? ""}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Rp 25.000"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Pembuat / UMKM</Label>
                <Input
                  value={form.maker ?? ""}
                  onChange={(e) => setForm({ ...form, maker: e.target.value })}
                  placeholder="Nama warga / kelompok"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Kontak WhatsApp Pemesanan</Label>
              <Input
                value={form.whatsapp ?? ""}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Foto Produk</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(p) => setForm({ ...form, image_url: p })}
                folder="produk"
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

      {/* Preview */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{preview?.p.name}</DialogTitle>
            <DialogDescription>Pratinjau tampilan produk.</DialogDescription>
          </DialogHeader>
          {preview?.img && (
            <img src={preview.img} alt={preview.p.name} className="aspect-video w-full rounded-md object-cover" />
          )}
          <div className="space-y-2 text-sm">
            <p>
              <Badge variant="outline">{preview?.p.category}</Badge>{" "}
              {preview?.p.price && <span className="font-semibold text-forest">{preview.p.price}</span>}
            </p>
            <p className="text-muted-foreground">{preview?.p.description || "Belum ada deskripsi."}</p>
            {preview?.p.maker && <p className="text-xs">Dibuat oleh: {preview.p.maker}</p>}
            {preview?.p.whatsapp && <p className="text-xs">WhatsApp: {preview.p.whatsapp}</p>}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        onConfirm={confirmDelete}
        title={`Hapus produk "${toDelete?.name}"?`}
      />
    </div>
  );
}

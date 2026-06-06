import { Plus, Trash2 } from "lucide-react";
import ContentForm from "@/components/admin/ContentForm";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Item = { year: string; title: string; desc: string };
type Data = {
  eyebrow: string;
  title: string;
  highlight_title: string;
  highlight_body: string;
  items: Item[];
};

const defaults: Data = {
  eyebrow: "Sejarah & Tradisi",
  title: "Jejak Waktu Kampung Cireundeu",
  highlight_title: "",
  highlight_body: "",
  items: [],
};

export default function JejakWaktu() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Kelola Jejak Waktu"
        description="Atur garis waktu sejarah Kampung Adat Cireundeu yang tampil di halaman publik."
      />
      <Card className="border-border shadow-card">
        <CardContent className="pt-6">
          <ContentForm<Data>
            contentKey="timeline"
            defaults={defaults}
            render={(d, set) => (
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Eyebrow</Label>
                    <Input value={d.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
                  </div>
                  <div>
                    <Label>Judul Bagian</Label>
                    <Input value={d.title} onChange={(e) => set("title", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Item Jejak Waktu</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => set("items", [...d.items, { year: "", title: "", desc: "" }])}
                    >
                      <Plus className="h-4 w-4" /> Tambah
                    </Button>
                  </div>
                  {d.items.map((it, i) => (
                    <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[120px_1fr_auto]">
                      <Input
                        placeholder="Tahun (cth. 1918)"
                        value={it.year}
                        onChange={(e) => {
                          const items = [...d.items];
                          items[i] = { ...it, year: e.target.value };
                          set("items", items);
                        }}
                      />
                      <div className="space-y-2">
                        <Input
                          placeholder="Judul"
                          value={it.title}
                          onChange={(e) => {
                            const items = [...d.items];
                            items[i] = { ...it, title: e.target.value };
                            set("items", items);
                          }}
                        />
                        <Textarea
                          rows={2}
                          placeholder="Deskripsi"
                          value={it.desc}
                          onChange={(e) => {
                            const items = [...d.items];
                            items[i] = { ...it, desc: e.target.value };
                            set("items", items);
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => set("items", d.items.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3">
                  <div>
                    <Label>Highlight — Judul (opsional)</Label>
                    <Input
                      value={d.highlight_title}
                      onChange={(e) => set("highlight_title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Highlight — Isi</Label>
                    <Textarea
                      rows={3}
                      value={d.highlight_body}
                      onChange={(e) => set("highlight_body", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import ContentForm from "@/components/admin/ContentForm";
import PageHeader from "@/components/admin/PageHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type AboutData = { title: string; body: string };
type HistData = { title: string; body: string };
type FeaturesItem = { icon: string; eyebrow: string; title: string; body: string };
type FeaturesData = { eyebrow: string; title: string; items: FeaturesItem[] };

export default function KontenPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Konten Halaman"
        description="Edit teks utama tiap bagian website. Perubahan langsung terlihat di halaman publik."
      />

      <section>
        <h2 className="font-display text-lg text-forest mb-3">Tentang Kami</h2>
        <Card className="border-border">
          <CardContent className="pt-6">
            <ContentForm<AboutData>
              contentKey="about"
              defaults={{ title: "", body: "" }}
              render={(d, set) => (
                <div className="space-y-4">
                  <div>
                    <Label>Judul</Label>
                    <Input value={d.title} onChange={(e) => set("title", e.target.value)} />
                  </div>
                  <div>
                    <Label>Isi</Label>
                    <Textarea rows={6} value={d.body} onChange={(e) => set("body", e.target.value)} />
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-lg text-forest mb-3">Sejarah & Profil Adat</h2>
        <Card className="border-border">
          <CardContent className="pt-6">
            <ContentForm<HistData>
              contentKey="history"
              defaults={{ title: "", body: "" }}
              render={(d, set) => (
                <div className="space-y-4">
                  <div>
                    <Label>Judul</Label>
                    <Input value={d.title} onChange={(e) => set("title", e.target.value)} />
                  </div>
                  <div>
                    <Label>Isi</Label>
                    <Textarea rows={6} value={d.body} onChange={(e) => set("body", e.target.value)} />
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-lg text-forest mb-3">Tiga Pilar (Features)</h2>
        <Card className="border-border">
          <CardContent className="pt-6">
            <ContentForm<FeaturesData>
              contentKey="features"
              defaults={{ eyebrow: "Keunikan Utama", title: "Tiga Pilar Kehidupan Cireundeu", items: [] }}
              render={(d, set) => (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Eyebrow</Label>
                      <Input value={d.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
                    </div>
                    <div>
                      <Label>Judul</Label>
                      <Input value={d.title} onChange={(e) => set("title", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Item</Label>
                    {d.items.map((it, i) => (
                      <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-4">
                        <Input
                          placeholder="Icon (Wheat, Sprout, Trees…)"
                          value={it.icon}
                          onChange={(e) => {
                            const items = [...d.items];
                            items[i] = { ...it, icon: e.target.value };
                            set("items", items);
                          }}
                        />
                        <Input
                          placeholder="Eyebrow"
                          value={it.eyebrow}
                          onChange={(e) => {
                            const items = [...d.items];
                            items[i] = { ...it, eyebrow: e.target.value };
                            set("items", items);
                          }}
                        />
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
                          value={it.body}
                          onChange={(e) => {
                            const items = [...d.items];
                            items[i] = { ...it, body: e.target.value };
                            set("items", items);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

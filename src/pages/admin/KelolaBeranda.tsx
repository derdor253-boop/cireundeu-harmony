import PageHeader from "@/components/admin/PageHeader";
import ContentForm from "@/components/admin/ContentForm";
import ImageUpload from "@/components/admin/ImageUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type HeroData = {
  headline: string;
  subheadline: string;
  badge_text: string;
  hero_image_url: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
};

const empty: HeroData = {
  headline: "",
  subheadline: "",
  badge_text: "",
  hero_image_url: "",
  cta_primary_label: "Jelajahi Kampung",
  cta_primary_href: "#wisata",
  cta_secondary_label: "Reservasi Kunjungan",
  cta_secondary_href: "#kontak",
};

export default function KelolaBeranda() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Kelola Beranda"
        description="Atur headline, sub-headline, badge, tombol CTA, dan gambar latar bagian Hero."
      />
      <Card className="border-border shadow-card">
        <CardContent className="pt-6">
          <ContentForm<HeroData>
            contentKey="hero"
            defaults={empty}
            render={(d, set) => (
              <div className="space-y-4">
                <div>
                  <Label>Badge (teks kecil di atas headline)</Label>
                  <Input value={d.badge_text} onChange={(e) => set("badge_text", e.target.value)} />
                </div>
                <div>
                  <Label>Headline</Label>
                  <Input value={d.headline} onChange={(e) => set("headline", e.target.value)} />
                </div>
                <div>
                  <Label>Sub-headline</Label>
                  <Textarea rows={3} value={d.subheadline} onChange={(e) => set("subheadline", e.target.value)} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Tombol Utama — Label</Label>
                    <Input value={d.cta_primary_label} onChange={(e) => set("cta_primary_label", e.target.value)} />
                  </div>
                  <div>
                    <Label>Tombol Utama — Tujuan</Label>
                    <Input value={d.cta_primary_href} onChange={(e) => set("cta_primary_href", e.target.value)} />
                  </div>
                  <div>
                    <Label>Tombol Sekunder — Label</Label>
                    <Input value={d.cta_secondary_label} onChange={(e) => set("cta_secondary_label", e.target.value)} />
                  </div>
                  <div>
                    <Label>Tombol Sekunder — Tujuan</Label>
                    <Input value={d.cta_secondary_href} onChange={(e) => set("cta_secondary_href", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Gambar Latar Hero (opsional)</Label>
                  <ImageUpload
                    value={d.hero_image_url || null}
                    onChange={(p) => set("hero_image_url", p ?? "")}
                    folder="hero"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kosongkan untuk pakai gambar latar default.
                  </p>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

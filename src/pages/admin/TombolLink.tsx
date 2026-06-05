import ContentForm from "@/components/admin/ContentForm";
import PageHeader from "@/components/admin/PageHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type SocialEntry = { url: string; active: boolean };
type SocialData = {
  instagram: SocialEntry;
  facebook: SocialEntry;
  tiktok: SocialEntry;
  youtube: SocialEntry;
};

type HeroData = {
  headline: string;
  subheadline: string;
  badge_text: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
};

export default function TombolLinkPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Tombol & Link"
        description="Kelola label dan tujuan tombol CTA utama, serta tautan media sosial."
      />

      <section>
        <h2 className="font-display text-lg text-forest mb-3">Tombol Hero (Beranda)</h2>
        <Card className="border-border">
          <CardContent className="pt-6">
            <ContentForm<HeroData>
              contentKey="hero"
              defaults={{
                headline: "",
                subheadline: "",
                badge_text: "",
                cta_primary_label: "Jelajahi Kampung",
                cta_primary_href: "#wisata",
                cta_secondary_label: "Reservasi Kunjungan",
                cta_secondary_href: "#kontak",
              }}
              render={(d, set) => (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Label Tombol Utama</Label>
                      <Input value={d.cta_primary_label} onChange={(e) => set("cta_primary_label", e.target.value)} />
                    </div>
                    <div>
                      <Label>Tujuan (URL / #anchor)</Label>
                      <Input value={d.cta_primary_href} onChange={(e) => set("cta_primary_href", e.target.value)} />
                    </div>
                    <div>
                      <Label>Label Tombol Sekunder</Label>
                      <Input value={d.cta_secondary_label} onChange={(e) => set("cta_secondary_label", e.target.value)} />
                    </div>
                    <div>
                      <Label>Tujuan</Label>
                      <Input value={d.cta_secondary_href} onChange={(e) => set("cta_secondary_href", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-lg text-forest mb-3">Tautan Media Sosial</h2>
        <Card className="border-border">
          <CardContent className="pt-6">
            <ContentForm<SocialData>
              contentKey="social_links"
              defaults={{
                instagram: { url: "", active: false },
                facebook: { url: "", active: false },
                tiktok: { url: "", active: false },
                youtube: { url: "", active: false },
              }}
              render={(d, set) => (
                <div className="space-y-4">
                  {(["instagram", "facebook", "tiktok", "youtube"] as const).map((k) => (
                    <div key={k} className="grid items-center gap-2 sm:grid-cols-[120px_1fr_80px]">
                      <Label className="capitalize">{k}</Label>
                      <Input
                        placeholder={`https://${k}.com/...`}
                        value={d[k].url}
                        onChange={(e) => set(k, { ...d[k], url: e.target.value })}
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={d[k].active}
                          onCheckedChange={(v) => set(k, { ...d[k], active: v })}
                        />
                        <span className="text-xs text-muted-foreground">{d[k].active ? "Aktif" : "Mati"}</span>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">
                    Hanya yang berstatus Aktif & memiliki URL akan ditampilkan di navbar/footer.
                  </p>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

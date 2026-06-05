import ContentForm from "@/components/admin/ContentForm";
import PageHeader from "@/components/admin/PageHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type WaData = {
  number: string;
  display: string;
  default_message: string;
  hero_message: string;
  reservation_message: string;
  footer_message: string;
};

export default function WhatsappPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp"
        description="Atur nomor WhatsApp, label tampilan, dan pesan default untuk semua tombol WA di website."
      />
      <Card className="border-border">
        <CardContent className="pt-6">
          <ContentForm<WaData>
            contentKey="whatsapp"
            defaults={{
              number: "",
              display: "",
              default_message: "",
              hero_message: "",
              reservation_message: "",
              footer_message: "",
            }}
            render={(d, set) => (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Nomor (format internasional, tanpa +)</Label>
                    <Input
                      placeholder="6281200000000"
                      value={d.number}
                      onChange={(e) => set("number", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Label Tampilan</Label>
                    <Input
                      placeholder="+62 812-0000-0000"
                      value={d.display}
                      onChange={(e) => set("display", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Pesan Default</Label>
                  <Textarea rows={2} value={d.default_message} onChange={(e) => set("default_message", e.target.value)} />
                </div>
                <div>
                  <Label>Pesan Tombol Hero</Label>
                  <Textarea rows={2} value={d.hero_message} onChange={(e) => set("hero_message", e.target.value)} />
                </div>
                <div>
                  <Label>Pesan Tombol Reservasi</Label>
                  <Textarea
                    rows={2}
                    value={d.reservation_message}
                    onChange={(e) => set("reservation_message", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Pesan Tombol Footer</Label>
                  <Textarea rows={2} value={d.footer_message} onChange={(e) => set("footer_message", e.target.value)} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: kosongkan nomor untuk menyembunyikan semua tombol WhatsApp.
                </p>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

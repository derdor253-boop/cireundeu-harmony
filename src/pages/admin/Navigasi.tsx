import ContentForm from "@/components/admin/ContentForm";
import PageHeader from "@/components/admin/PageHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

type Item = { label: string; href: string; active: boolean; external: boolean };
type Nav = { items: Item[] };

export default function NavigasiPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Navigasi"
        description="Atur menu navbar website (label, tujuan, urutan, status aktif, dan buka di tab baru)."
      />
      <Card className="border-border">
        <CardContent className="pt-6">
          <ContentForm<Nav>
            contentKey="navigation"
            defaults={{ items: [] }}
            render={(d, set) => {
              const move = (i: number, dir: -1 | 1) => {
                const items = [...d.items];
                const j = i + dir;
                if (j < 0 || j >= items.length) return;
                [items[i], items[j]] = [items[j], items[i]];
                set("items", items);
              };
              return (
                <div className="space-y-3">
                  {d.items.map((it, i) => (
                    <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_1fr_auto_auto_auto]">
                      <Input
                        placeholder="Label menu"
                        value={it.label}
                        onChange={(e) => {
                          const items = [...d.items]; items[i] = { ...it, label: e.target.value }; set("items", items);
                        }}
                      />
                      <Input
                        placeholder="#anchor atau URL"
                        value={it.href}
                        onChange={(e) => {
                          const items = [...d.items]; items[i] = { ...it, href: e.target.value }; set("items", items);
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Switch checked={it.active} onCheckedChange={(v) => {
                          const items = [...d.items]; items[i] = { ...it, active: v }; set("items", items);
                        }} />
                        <Label className="text-xs">Aktif</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={it.external} onCheckedChange={(v) => {
                          const items = [...d.items]; items[i] = { ...it, external: v }; set("items", items);
                        }} />
                        <Label className="text-xs">Tab baru</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => set("items", d.items.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      set("items", [...d.items, { label: "Menu baru", href: "#", active: true, external: false }])
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" /> Tambah Menu
                  </Button>
                </div>
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

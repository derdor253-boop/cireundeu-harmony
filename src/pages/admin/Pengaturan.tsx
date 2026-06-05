import PageHeader from "@/components/admin/PageHeader";
import ContentForm from "@/components/admin/ContentForm";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

type GlobalData = {
  site_name: string;
  tagline: string;
  meta_title: string;
  meta_description: string;
  favicon_url: string;
  logo_url: string;
};

type FooterData = {
  tagline: string;
  copyright: string;
  footnote: string;
};

export default function PengaturanPage() {
  const { user } = useAdminAuth();
  const [pwd, setPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const savePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 8) return toast.error("Kata sandi minimal 8 karakter");
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSavingPwd(false);
    if (error) toast.error(error.message);
    else { toast.success("Kata sandi diperbarui"); setPwd(""); }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Pengaturan Website"
        description="Kelola identitas website, meta SEO, footer, dan akun admin."
      />

      <Card className="border-border">
        <CardContent className="pt-6">
          <h3 className="font-display text-base mb-4 text-forest">Identitas & SEO</h3>
          <ContentForm<GlobalData>
            contentKey="global_settings"
            defaults={{ site_name: "", tagline: "", meta_title: "", meta_description: "", favicon_url: "", logo_url: "" }}
            render={(d, set) => (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Nama Website</Label>
                    <Input value={d.site_name} onChange={(e) => set("site_name", e.target.value)} />
                  </div>
                  <div>
                    <Label>Tagline</Label>
                    <Input value={d.tagline} onChange={(e) => set("tagline", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Meta Title (untuk Google)</Label>
                  <Input value={d.meta_title} onChange={(e) => set("meta_title", e.target.value)} />
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Textarea rows={2} value={d.meta_description} onChange={(e) => set("meta_description", e.target.value)} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>URL Favicon</Label>
                    <Input value={d.favicon_url} onChange={(e) => set("favicon_url", e.target.value)} />
                  </div>
                  <div>
                    <Label>URL Logo Utama</Label>
                    <Input value={d.logo_url} onChange={(e) => set("logo_url", e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="pt-6">
          <h3 className="font-display text-base mb-4 text-forest">Footer</h3>
          <ContentForm<FooterData>
            contentKey="footer"
            defaults={{ tagline: "", copyright: "", footnote: "" }}
            render={(d, set) => (
              <div className="space-y-4">
                <div>
                  <Label>Tagline Footer</Label>
                  <Textarea rows={2} value={d.tagline} onChange={(e) => set("tagline", e.target.value)} />
                </div>
                <div>
                  <Label>Copyright</Label>
                  <Input value={d.copyright} onChange={(e) => set("copyright", e.target.value)} />
                </div>
                <div>
                  <Label>Catatan kaki</Label>
                  <Input value={d.footnote} onChange={(e) => set("footnote", e.target.value)} />
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="pt-6">
          <h3 className="font-display text-base mb-4 text-forest flex items-center gap-2">
            <KeyRound className="h-4 w-4" /> Ubah Kata Sandi
          </h3>
          <form onSubmit={savePwd} className="space-y-3">
            <div>
              <Label>Email</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <div>
              <Label>Kata Sandi Baru</Label>
              <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} minLength={8} placeholder="Minimal 8 karakter" />
            </div>
            <Button type="submit" disabled={savingPwd} className="bg-forest hover:bg-forest-light text-cream">
              {savingPwd ? "Menyimpan…" : "Perbarui Kata Sandi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

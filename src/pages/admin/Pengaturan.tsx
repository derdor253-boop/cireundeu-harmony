import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/admin/PageHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { KeyRound, User } from "lucide-react";

export default function PengaturanPage() {
  const { user, fullName } = useAdminAuth();
  const [name, setName] = useState(fullName);
  const [pwd, setPwd] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingName(true);
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    setSavingName(false);
    if (error) toast.error("Gagal menyimpan");
    else toast.success("Nama berhasil diperbarui");
  };

  const savePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 8) {
      toast.error("Kata sandi minimal 8 karakter");
      return;
    }
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSavingPwd(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Kata sandi diperbarui");
      setPwd("");
    }
  };

  const domain = typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Pengaturan Website" description="Kelola akun admin dan informasi dasar website." />

      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" /> Profil Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveName} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Nama Lengkap</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button type="submit" disabled={savingName} className="bg-forest hover:bg-forest-light">
              {savingName ? "Menyimpan…" : "Simpan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><KeyRound className="h-4 w-4" /> Ubah Kata Sandi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={savePwd} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Kata Sandi Baru</Label>
              <Input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                minLength={8}
                placeholder="Minimal 8 karakter"
              />
            </div>
            <Button type="submit" disabled={savingPwd} className="bg-forest hover:bg-forest-light">
              {savingPwd ? "Menyimpan…" : "Perbarui Kata Sandi"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-muted/40">
        <CardHeader>
          <CardTitle className="text-base">Informasi Website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p><span className="text-muted-foreground">Domain:</span> {domain}</p>
          <p><span className="text-muted-foreground">Status:</span> Aktif</p>
          <p className="text-xs text-muted-foreground">
            Untuk mengganti domain, hubungi pengelola teknis website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Row = {
  user_id: string;
  full_name: string | null;
  role: string;
};

export default function Pengguna() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [savingCode, setSavingCode] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: roles }, { data: profiles }, { data: codes }] = await Promise.all([
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("profiles").select("id, full_name"),
        supabase.from("registration_codes").select("code, active").eq("active", true).limit(1),
      ]);
      const profMap = new Map((profiles ?? []).map((p) => [p.id as string, p.full_name as string | null]));
      const list: Row[] = (roles ?? []).map((r) => ({
        user_id: r.user_id as string,
        role: r.role as string,
        full_name: profMap.get(r.user_id as string) ?? null,
      }));
      setRows(list);
      if (codes?.[0]?.code) setCode(codes[0].code as string);
      setLoading(false);
    })();
  }, []);

  const updateCode = async () => {
    if (!code.trim()) return toast.error("Kode tidak boleh kosong");
    setSavingCode(true);
    // Nonaktifkan semua kode lama, lalu masukkan kode baru
    await supabase.from("registration_codes").update({ active: false }).eq("active", true);
    const { error } = await supabase.from("registration_codes").insert({ code: code.trim(), active: true });
    setSavingCode(false);
    if (error) toast.error("Gagal: " + error.message);
    else toast.success("Kode pendaftaran diperbarui.");
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 p-6 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Memuat…
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Manajemen Pengguna"
        description="Lihat daftar admin & operator serta atur kode pendaftaran untuk akun baru."
      />

      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg text-forest">
            <ShieldCheck className="h-5 w-5" /> Kode Pendaftaran Aktif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Bagikan kode ini secara pribadi kepada warga/pengurus yang akan diberi akses. Mengubah kode
            akan menonaktifkan kode lama.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="code">Kode Rahasia</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={updateCode} disabled={savingCode} className="bg-forest hover:bg-forest-light">
                {savingCode ? "Menyimpan…" : "Perbarui Kode"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg text-forest">
            <Users className="h-5 w-5" /> Daftar Akun ({rows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada akun terdaftar.</p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li key={r.user_id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">{r.full_name || "(Tanpa nama)"}</p>
                    <p className="text-xs text-muted-foreground">{r.user_id.slice(0, 8)}…</p>
                  </div>
                  <Badge variant={r.role === "admin" ? "default" : "secondary"}>
                    {r.role === "admin" ? "Admin" : "Operator"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Akun baru otomatis berperan sebagai <strong>Operator</strong>. Akun pertama yang mendaftar
            otomatis menjadi <strong>Admin</strong>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

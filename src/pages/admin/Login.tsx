import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sprout, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAdminAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [regCode, setRegCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/admin", { replace: true });
  }, [loading, user, isAdmin, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Berhasil masuk");
      } else {
        // Verifikasi kode pendaftaran terlebih dulu
        const { data: valid, error: rpcErr } = await supabase.rpc("validate_registration_code", {
          _code: regCode.trim(),
        });
        if (rpcErr) throw rpcErr;
        if (!valid) {
          throw new Error(
            "Kode Pendaftaran tidak valid. Hubungi admin utama untuk meminta kode resmi.",
          );
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/#/admin`,
            data: { full_name: fullName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Akun berhasil dibuat. Silakan masuk.");
        setMode("login");
        setRegCode("");
      }
    } catch (err: any) {
      const msg = err?.message ?? "Terjadi kesalahan";
      const indo = msg.includes("Invalid login")
        ? "Email atau kata sandi salah."
        : msg.includes("already registered")
          ? "Email sudah terdaftar."
          : msg.includes("Password should")
            ? "Kata sandi minimal 6 karakter."
            : msg;
      setError(indo);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-gradient p-4">
      <Card className="w-full max-w-md border-border shadow-soft">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest text-cream">
            <Sprout className="h-6 w-6" />
          </div>
          <CardTitle className="font-display text-2xl text-forest">
            {mode === "login" ? "Masuk Dasbor Admin" : "Daftar Akun Operator"}
          </CardTitle>
          <CardDescription>Kampung Adat Cireundeu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama operator"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="regcode" className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-forest" />
                    Kode Pendaftaran *
                  </Label>
                  <Input
                    id="regcode"
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value)}
                    required
                    placeholder="Masukkan kode rahasia dari admin utama"
                  />
                  <p className="text-xs text-muted-foreground">
                    Wajib. Hanya warga & pengurus yang menerima kode dari admin utama yang dapat
                    mendaftar.
                  </p>
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="operator@cireundeu.id"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
              />
            </div>
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-forest hover:bg-forest-light"
            >
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "login" ? "Masuk" : "Daftar"}
            </Button>
            <div className="text-center text-sm">
              {mode === "login" ? (
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-forest hover:underline"
                >
                  Belum punya akun? Daftar dengan Kode
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-forest hover:underline"
                >
                  Sudah punya akun? Masuk
                </button>
              )}
            </div>
          </form>

          <p className="mt-6 rounded-md bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
            Akun pertama yang berhasil mendaftar otomatis menjadi <strong>Admin</strong>. Akun
            berikutnya menjadi <strong>Operator</strong>.
          </p>
          <p className="mt-3 text-center text-xs">
            <Link to="/" className="text-muted-foreground hover:text-forest hover:underline">
              ← Kembali ke website utama
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

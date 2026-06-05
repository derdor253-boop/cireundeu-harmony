import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface Props<T extends Record<string, any>> {
  contentKey: string;
  defaults: T;
  render: (
    data: T,
    set: <K extends keyof T>(k: K, v: T[K]) => void,
  ) => React.ReactNode;
}

export default function ContentForm<T extends Record<string, any>>({
  contentKey,
  defaults,
  render,
}: Props<T>) {
  const [data, setData] = useState<T>(defaults);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase
      .from("site_content")
      .select("data")
      .eq("key", contentKey)
      .maybeSingle()
      .then(({ data: row }) => {
        if (!alive) return;
        if (row?.data) setData({ ...defaults, ...(row.data as T) });
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey]);

  const set = <K extends keyof T>(k: K, v: T[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: contentKey, data: data as any }, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error("Gagal menyimpan: " + error.message);
    else toast.success("Tersimpan. Halaman publik akan otomatis diperbarui.");
  };

  if (!loaded) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Memuat…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {render(data, set)}
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="bg-forest hover:bg-forest-light text-cream">
          {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
          {saving ? "Menyimpan…" : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}

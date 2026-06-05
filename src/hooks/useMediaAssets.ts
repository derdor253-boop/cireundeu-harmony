import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MediaAsset {
  id: string;
  slot: string;
  name: string;
  image_url: string | null;
  link_url: string | null;
  target: string;
  active: boolean;
  sort_order: number;
}

export function useMediaAssets(slot: string) {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { data } = await supabase
        .from("media_assets")
        .select("*")
        .eq("slot", slot)
        .order("sort_order", { ascending: true });
      if (!alive) return;
      setItems((data as any) ?? []);
      setLoaded(true);
    };
    load();
    const channel = supabase
      .channel(`media_assets_${slot}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "media_assets", filter: `slot=eq.${slot}` },
        load,
      )
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [slot]);

  return { items, loaded };
}

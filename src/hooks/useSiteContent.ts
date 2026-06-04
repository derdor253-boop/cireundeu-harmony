import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent<T extends Record<string, any>>(key: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    supabase
      .from("site_content")
      .select("data")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        if (data?.data) setData({ ...fallback, ...(data.data as T) });
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return { data, loaded };
}

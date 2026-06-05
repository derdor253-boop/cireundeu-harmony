import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

type ContentMap = Record<string, Record<string, any>>;

interface Ctx {
  content: ContentMap;
  loaded: boolean;
  refresh: () => Promise<void>;
}

const SiteContentContext = createContext<Ctx>({
  content: {},
  loaded: false,
  refresh: async () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({});
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("key,data");
    const map: ContentMap = {};
    (data ?? []).forEach((row: any) => {
      map[row.key] = row.data || {};
    });
    setContent(map);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    // Live updates: refetch on any change
    const channel = supabase
      .channel("site_content_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => refresh(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  return createElement(
    SiteContentContext.Provider,
    { value: { content, loaded, refresh } },
    children,
  );
}

/**
 * Backward-compatible hook: returns { data, loaded } for a given key,
 * merging in fallback defaults if the key is missing.
 */
export function useSiteContent<T extends Record<string, any>>(
  key: string,
  fallback: T,
) {
  const { content, loaded } = useContext(SiteContentContext);
  const stored = content[key];
  const data = (stored ? { ...fallback, ...stored } : fallback) as T;
  return { data, loaded };
}

export function useAllSiteContent() {
  return useContext(SiteContentContext);
}

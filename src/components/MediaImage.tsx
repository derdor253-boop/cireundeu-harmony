import { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/lib/mediaUrl";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  source?: string | null;
  fallbackSrc?: string;
}

/**
 * Image that accepts either a full URL, a Supabase storage path, or falls back to a static asset.
 */
export default function MediaImage({ source, fallbackSrc, alt = "", ...rest }: Props) {
  const [src, setSrc] = useState<string | null>(fallbackSrc ?? null);

  useEffect(() => {
    let alive = true;
    if (!source) {
      setSrc(fallbackSrc ?? null);
      return;
    }
    resolveMediaUrl(source).then((url) => {
      if (!alive) return;
      setSrc(url || fallbackSrc || null);
    });
    return () => {
      alive = false;
    };
  }, [source, fallbackSrc]);

  if (!src) return null;
  return <img src={src} alt={alt} {...rest} />;
}

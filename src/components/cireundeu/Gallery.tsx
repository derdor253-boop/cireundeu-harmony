import { useEffect, useState } from "react";
import SundaDivider from "./SundaDivider";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrl } from "@/lib/storage";

type Photo = {
  id: string;
  title: string | null;
  caption: string | null;
  category: string | null;
  image_url: string;
};

function GalleryItem({ p }: { p: Photo }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    getSignedUrl(p.image_url).then(setUrl);
  }, [p.image_url]);
  return (
    <figure className="group relative overflow-hidden rounded-2xl border border-border shadow-card cursor-pointer aspect-square sm:aspect-auto">
      {url && (
        <img
          src={url}
          alt={p.title ?? "Foto galeri"}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {(p.title || p.caption) && (
        <figcaption className="absolute bottom-0 left-0 right-0 p-4 text-cream text-sm font-medium translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          {p.title}
          {p.caption && <span className="block text-xs opacity-80">{p.caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

const Gallery = () => {
  const [items, setItems] = useState<Photo[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Photo[]) ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("gallery_public")
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_photos" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  return (
    <section id="galeri" className="py-20 md:py-28 bg-cream">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
            Katalog Visual
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl text-forest font-display">Galeri Kampung Cireundeu</h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
          <p className="mt-4 text-foreground/75">
            Dokumentasi alam, budaya, dan keseharian warga adat — dari Puncak Salam hingga dapur tradisional.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            Belum ada foto. Tambahkan foto dari Dasbor Admin → Katalog Visual.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {items.map((p) => (
              <GalleryItem key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
      <SundaDivider />
    </section>
  );
};

export default Gallery;

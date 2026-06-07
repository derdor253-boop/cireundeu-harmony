import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import SundaDivider from "./SundaDivider";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrl } from "@/lib/storage";

type Pkg = {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  price: string | null;
  image_url: string | null;
  features: any;
  active: boolean;
  sort_order: number;
};

function ActivityCard({ p }: { p: Pkg }) {
  const [img, setImg] = useState<string | null>(null);
  useEffect(() => {
    getSignedUrl(p.image_url).then(setImg);
  }, [p.image_url]);
  const features: string[] = Array.isArray(p.features) ? p.features : [];
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-gold hover:shadow-soft transition-all flex flex-col">
      <div className="overflow-hidden aspect-[4/3] bg-muted">
        {img && (
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <span className="inline-grid h-12 w-12 place-items-center rounded-lg bg-terracotta/10 text-terracotta group-hover:bg-terracotta group-hover:text-cream transition-colors">
          <MapPin className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-xl text-forest">{p.name}</h3>
        {p.duration && <p className="mt-1 text-xs text-muted-foreground">{p.duration}</p>}
        {p.price && <p className="mt-1 text-sm font-semibold text-terracotta">{p.price}</p>}
        {p.description && <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{p.description}</p>}
        {features.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-foreground/75">
            {features.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

const Activities = () => {
  const [items, setItems] = useState<Pkg[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("tour_packages")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    setItems((data as Pkg[]) ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("tour_packages_public")
      .on("postgres_changes", { event: "*", schema: "public", table: "tour_packages" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  return (
    <section id="wisata" className="py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
            Wisata & Aktivitas
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl text-forest">Pengalaman Otentik di Tanah Adat</h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
          <p className="mt-4 text-foreground/75">
            Beragam aktivitas budaya, kuliner, dan spiritual yang dapat Anda ikuti bersama warga.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">Belum ada aktivitas yang dipublikasikan.</p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ActivityCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
      <SundaDivider />
    </section>
  );
};

export default Activities;

import { useEffect, useState } from "react";
import SundaDivider from "./SundaDivider";
import { useSiteContent } from "@/hooks/useSiteContent";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import rasiImg from "@/assets/cuisine/rasi-goreng.jpeg";

type Dish = {
  id?: string;
  name: string;
  description?: string;
  price?: string;
  image_url?: string;
};

const DEFAULTS = { items: [] as Dish[] };

function DishCard({ d }: { d: Dish }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    resolveMediaUrl(d.image_url).then((u) => alive && setSrc(u));
    return () => {
      alive = false;
    };
  }, [d.image_url]);

  return (
    <article className="group overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
      <div className="overflow-hidden aspect-[4/3] bg-muted">
        <img
          src={src || rasiImg}
          alt={d.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl text-forest">{d.name}</h3>
          {d.price && (
            <span className="shrink-0 text-sm font-semibold text-terracotta">{d.price}</span>
          )}
        </div>
        {d.description && (
          <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{d.description}</p>
        )}
      </div>
    </article>
  );
}

const Cuisine = () => {
  const { data } = useSiteContent("kuliner", DEFAULTS);
  const items = data.items ?? [];

  return (
    <section id="kuliner" className="py-20 md:py-28 bg-warm-gradient">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
            Kuliner Khas
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl text-forest">
            Cita Rasa Adat dari Tanah Cireundeu
          </h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
          <p className="mt-4 text-foreground/75">
            Olahan singkong yang menjadi nadi dapur masyarakat — sederhana, bergizi, dan penuh warisan.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">Belum ada kuliner ditampilkan.</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d, i) => (
              <DishCard key={d.id || i} d={d} />
            ))}
          </div>
        )}
      </div>
      <SundaDivider />
    </section>
  );
};

export default Cuisine;

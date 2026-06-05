import { useSiteContent } from "@/hooks/useSiteContent";
import { getIcon } from "@/lib/icons";

type Item = { icon: string; eyebrow: string; title: string; body: string };
const DEFAULTS = {
  eyebrow: "Keunikan Utama",
  title: "Tiga Pilar Kehidupan Cireundeu",
  items: [] as Item[],
};

const Features = () => {
  const { data } = useSiteContent("features", DEFAULTS);
  const items = data.items?.length ? data.items : [];
  if (items.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-warm-gradient">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">{data.eyebrow}</span>
          <h2 className="mt-3 text-3xl md:text-4xl text-forest">{data.title}</h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => {
            const Icon = getIcon(it.icon);
            return (
              <article
                key={i}
                className="group rounded-2xl bg-card border border-border p-7 shadow-card hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300"
              >
                <span className="inline-grid h-14 w-14 place-items-center rounded-xl bg-forest text-cream group-hover:bg-gold group-hover:text-ink transition-colors">
                  <Icon className="h-7 w-7" />
                </span>
                <div className="mt-5 text-xs uppercase tracking-widest text-terracotta font-semibold">{it.eyebrow}</div>
                <h3 className="mt-2 font-display text-2xl text-forest leading-tight">{it.title}</h3>
                <p className="mt-3 text-foreground/80 leading-relaxed">{it.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

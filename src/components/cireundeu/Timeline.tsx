import { Sparkles } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

type Item = { year: string; title: string; desc: string };
const DEFAULTS = {
  eyebrow: "Sejarah & Tradisi",
  title: "Jejak Waktu Kampung Cireundeu",
  highlight_title: "",
  highlight_body: "",
  items: [] as Item[],
};

const Timeline = () => {
  const { data } = useSiteContent("timeline", DEFAULTS);
  const items = data.items ?? [];

  return (
    <section id="sejarah" className="py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">{data.eyebrow}</span>
          <h2 className="mt-3 text-3xl md:text-4xl text-forest">{data.title}</h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
        </div>

        {items.length > 0 && (
          <div className="mt-14 relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-terracotta to-forest md:-translate-x-1/2" />
            <div className="space-y-10">
              {items.map((m, i) => (
                <div
                  key={i}
                  className={`relative flex md:items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 grid h-8 w-8 place-items-center rounded-full bg-gold text-ink shadow-soft ring-4 ring-cream font-display font-bold text-xs">
                    {i + 1}
                  </div>
                  <div className="md:w-1/2 md:px-8 pl-14 md:pl-0">
                    <div className="rounded-2xl bg-card border border-border p-5 shadow-card hover:shadow-soft transition-all">
                      <div className="text-xs uppercase tracking-widest text-terracotta font-bold">{m.year}</div>
                      <h3 className="mt-1 font-display text-xl text-forest">{m.title}</h3>
                      <p className="mt-2 text-sm text-foreground/75">{m.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {data.highlight_title && (
          <div className="mt-14 mx-auto max-w-3xl rounded-2xl bg-forest text-cream p-7 md:p-9 relative overflow-hidden">
            <div className="absolute inset-0 bg-woven opacity-25" aria-hidden="true" />
            <div className="relative flex gap-4 items-start">
              <Sparkles className="h-7 w-7 text-gold shrink-0" />
              <div>
                <h3 className="font-display text-2xl text-gold">{data.highlight_title}</h3>
                <p className="mt-2 text-cream/85 leading-relaxed">{data.highlight_body}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Timeline;

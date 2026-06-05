import { useSiteContent } from "@/hooks/useSiteContent";
import { getIcon } from "@/lib/icons";

type Item = { icon: string; value: string; label: string };

const DEFAULTS = { items: [] as Item[] };

const StatsBar = () => {
  const { data } = useSiteContent("stats", DEFAULTS);
  const stats = data.items ?? [];
  if (stats.length === 0) return null;

  return (
    <section aria-label="Statistik Kampung" className="relative -mt-12 z-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 rounded-2xl bg-card shadow-soft border border-border p-4 md:p-6">
          {stats.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <div key={i} className="flex items-center gap-3 md:gap-4 p-3 rounded-xl hover:bg-muted/60 transition-colors">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest/10 text-forest">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-display text-xl md:text-2xl font-bold text-forest leading-none">{s.value}</div>
                  <div className="mt-1 text-xs md:text-sm text-muted-foreground">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;

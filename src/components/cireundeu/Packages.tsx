import { Check, Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Pkg = {
  id: string;
  name: string;
  duration: string | null;
  price: string | null;
  description: string | null;
  features: string[];
  sort_order: number;
};

const Packages = () => {
  const [list, setList] = useState<Pkg[] | null>(null);

  useEffect(() => {
    supabase
      .from("tour_packages")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const items = (data ?? []).map((d: any) => ({
          ...d,
          features: Array.isArray(d.features) ? d.features : [],
        })) as Pkg[];
        setList(items);
      });
  }, []);

  return (
    <section id="paket" className="py-20 md:py-24 bg-forest text-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-woven opacity-30" aria-hidden="true" />
      <div className="container mx-auto relative">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase text-gold font-semibold">
            Paket Wisata
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl text-cream">Pilih Paket Kunjungan Anda</h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
          <p className="mt-4 text-cream/80">
            Harga per orang. Sudah termasuk 1× makan dengan menu utama{" "}
            <strong>rasi (beras singkong)</strong>.
          </p>
        </div>

        {list === null ? (
          <div className="mt-12 flex justify-center text-cream/70">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <p className="mt-12 text-center text-cream/70">Belum ada paket tersedia.</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {list.map((p, i) => {
              const highlight = i === 1 && list.length >= 2;
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl p-7 border transition-all ${
                    highlight
                      ? "bg-cream text-foreground border-gold scale-[1.02] shadow-soft"
                      : "bg-cream/5 border-cream/15 hover:border-gold/60"
                  }`}
                >
                  {highlight && (
                    <span className="inline-block mb-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink uppercase tracking-wider">
                      Paling Populer
                    </span>
                  )}
                  <h3 className={`font-display text-2xl ${highlight ? "text-forest" : "text-cream"}`}>
                    {p.name}
                  </h3>
                  {p.duration && (
                    <p className={`mt-1 text-sm ${highlight ? "text-muted-foreground" : "text-cream/70"}`}>
                      {p.duration}
                    </p>
                  )}
                  {p.price && (
                    <p
                      className={`mt-4 font-display font-bold text-2xl ${
                        highlight ? "text-forest" : "text-gold"
                      }`}
                    >
                      {p.price}
                    </p>
                  )}
                  {p.description && (
                    <p className={`mt-2 text-sm ${highlight ? "text-foreground/80" : "text-cream/80"}`}>
                      {p.description}
                    </p>
                  )}
                  {p.features.length > 0 && (
                    <ul className={`mt-5 space-y-2 ${highlight ? "text-foreground/85" : "text-cream/85"}`}>
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              highlight ? "text-forest" : "text-gold"
                            }`}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    asChild
                    className={`mt-6 w-full ${
                      highlight
                        ? "bg-forest text-cream hover:bg-forest-light"
                        : "bg-gold text-ink hover:bg-gold/90"
                    }`}
                  >
                    <a href="#kontak">
                      <Check className="mr-1 h-4 w-4" /> Pilih Paket Ini
                    </a>
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 mx-auto max-w-3xl rounded-xl bg-cream/10 border border-cream/15 p-5 flex gap-3 items-start">
          <Info className="h-5 w-5 shrink-0 text-gold mt-0.5" />
          <p className="text-sm text-cream/85">
            <strong className="text-gold">Harga masuk GRATIS.</strong> Reservasi wajib untuk paket
            wisata agar warga dapat mempersiapkan sambutan, makanan, dan jadwal aktivitas dengan baik.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Packages;

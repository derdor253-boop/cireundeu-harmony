import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const packages = [
  {
    name: "Paket Setengah Hari",
    sub: "2 aktivitas pilihan",
    highlight: false,
    tiers: [
      ["10 orang", "Rp 130.000"],
      ["20 orang", "Rp 90.000"],
      ["30 orang", "Rp 75.000"],
      ["40+ orang", "Rp 60.000"],
    ],
  },
  {
    name: "Paket Satu Hari",
    sub: "3 aktivitas pilihan",
    highlight: true,
    tiers: [
      ["10 orang", "Rp 180.000"],
      ["20 orang", "Rp 110.000"],
      ["30 orang", "Rp 90.000"],
      ["40+ orang", "Rp 70.000"],
    ],
  },
  {
    name: "Paket Menginap",
    sub: "Homestay rumah warga",
    highlight: false,
    tiers: [
      ["Harga", "Menyesuaikan"],
      ["Konsultasi", "via WhatsApp"],
    ],
    custom: true,
  },
];

const Packages = () => (
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
          Harga per orang. Sudah termasuk 1× makan dengan menu utama <strong>rasi (beras singkong)</strong>.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {packages.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl p-7 border transition-all ${
              p.highlight
                ? "bg-cream text-foreground border-gold scale-[1.02] shadow-soft"
                : "bg-cream/5 border-cream/15 hover:border-gold/60"
            }`}
          >
            {p.highlight && (
              <span className="inline-block mb-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink uppercase tracking-wider">
                Paling Populer
              </span>
            )}
            <h3 className={`font-display text-2xl ${p.highlight ? "text-forest" : "text-cream"}`}>
              {p.name}
            </h3>
            <p className={`mt-1 text-sm ${p.highlight ? "text-muted-foreground" : "text-cream/70"}`}>
              {p.sub}
            </p>

            <ul className={`mt-6 divide-y ${p.highlight ? "divide-border" : "divide-cream/10"}`}>
              {p.tiers.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between py-3">
                  <span className={`text-sm ${p.highlight ? "text-foreground/80" : "text-cream/80"}`}>
                    {k}
                  </span>
                  <span
                    className={`font-display font-bold ${
                      p.highlight ? "text-forest" : "text-gold"
                    }`}
                  >
                    {v}
                    {!p.custom && <span className="text-xs font-normal opacity-70">/orang</span>}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className={`mt-6 w-full ${
                p.highlight
                  ? "bg-forest text-cream hover:bg-forest-light"
                  : "bg-gold text-ink hover:bg-gold/90"
              }`}
            >
              <a href="#kontak">
                <Check className="mr-1 h-4 w-4" /> Pilih Paket Ini
              </a>
            </Button>
          </div>
        ))}
      </div>

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

export default Packages;

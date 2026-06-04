import { Wheat, Sprout, Trees } from "lucide-react";

const features = [
  {
    icon: Wheat,
    eyebrow: "Rasi Singkong",
    title: "Makanan Pokok Tanpa Beras",
    body: "Sejak 1918, masyarakat Cireundeu mengonsumsi rasi (beras singkong) sebagai pengganti nasi. Tradisi ini dipelopori oleh Ibu Omah Asnamah, yang dianugerahi gelar Pahlawan Pangan pada tahun 1964.",
  },
  {
    icon: Sprout,
    eyebrow: "Sunda Wiwitan",
    title: "Kepercayaan & Kearifan Lokal",
    body: "Ajaran leluhur yang mengajarkan hidup selaras dengan alam. Empat warna dasar — merah, kuning, hitam, dan putih — melambangkan keseimbangan unsur kehidupan manusia dan semesta.",
  },
  {
    icon: Trees,
    eyebrow: "Leuweung Tilu",
    title: "Tiga Kawasan Hutan Adat",
    body: "Wilayah hutan dibagi tiga: Leuweung Larangan (terlarang dijamah), Leuweung Tutupan (cadangan air & flora), dan Leuweung Baladahan (hutan produksi untuk kehidupan warga).",
  },
];

const Features = () => (
  <section className="py-20 md:py-24 bg-warm-gradient">
    <div className="container mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
          Keunikan Utama
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl text-forest">
          Tiga Pilar Kehidupan Cireundeu
        </h2>
        <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, eyebrow, title, body }) => (
          <article
            key={title}
            className="group rounded-2xl bg-card border border-border p-7 shadow-card hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300"
          >
            <span className="inline-grid h-14 w-14 place-items-center rounded-xl bg-forest text-cream group-hover:bg-gold group-hover:text-ink transition-colors">
              <Icon className="h-7 w-7" />
            </span>
            <div className="mt-5 text-xs uppercase tracking-widest text-terracotta font-semibold">
              {eyebrow}
            </div>
            <h3 className="mt-2 font-display text-2xl text-forest leading-tight">{title}</h3>
            <p className="mt-3 text-foreground/80 leading-relaxed">{body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Features;

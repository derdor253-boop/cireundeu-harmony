import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    tag: "Upacara Adat",
    date: "12 Juli 2025",
    title: "Festival 1 Suro: Perayaan Syukur Masyarakat Cireundeu",
    excerpt:
      "Ribuan warga dan tamu undangan turut hadir dalam pagelaran Angklung Buncis dan ritual syukur tahun baru Saka.",
    color: "2D5016",
  },
  {
    tag: "Edukasi",
    date: "28 Mei 2025",
    title: "Workshop Angklung Buncis Disambut Antusias Pelajar Cimahi",
    excerpt:
      "Lebih dari 80 pelajar mengikuti workshop seni musik tradisional yang digelar di balai kampung adat.",
    color: "8B4513",
  },
  {
    tag: "Pangan Lokal",
    date: "10 April 2025",
    title: "Rasi Singkong: Ketahanan Pangan Lokal yang Mendunia",
    excerpt:
      "Inovasi pangan dari Cireundeu kembali menarik perhatian peneliti internasional sebagai model pangan berkelanjutan.",
    color: "C9A84C",
  },
];

const News = () => (
  <section id="kabar" className="py-20 md:py-28">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
            Kabar Kampung
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl text-forest">Cerita Terbaru dari Cireundeu</h2>
          <div className="mt-3 h-1 w-20 bg-gold rounded-full" />
        </div>
        <Button asChild variant="outline" className="border-forest text-forest hover:bg-forest hover:text-cream w-fit">
          <a href="#">
            Lihat Semua Berita <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <article
            key={p.title}
            className="group flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-soft hover:-translate-y-1 transition-all"
          >
            <div className="overflow-hidden">
              <img
                src={`https://placehold.co/600x360/${p.color}/F5F0E8?text=${encodeURIComponent(p.tag)}`}
                alt={p.title}
                loading="lazy"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-gold/20 text-terracotta font-semibold px-2.5 py-1 uppercase tracking-wider">
                  {p.tag}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {p.date}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl text-forest leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-foreground/75 flex-1">{p.excerpt}</p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-terracotta hover:text-forest transition-colors"
              >
                Baca Selengkapnya <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default News;

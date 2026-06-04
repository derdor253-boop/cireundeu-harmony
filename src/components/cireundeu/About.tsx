import { Sparkles, Wheat } from "lucide-react";
import SundaDivider from "./SundaDivider";
import salamImg from "@/assets/photos/salam.png";
import homestayImg from "@/assets/photos/homestay.png";
import hamparanImg from "@/assets/photos/hamparan-singkong.png";
import upacaraImg from "@/assets/photos/upacara-adat.png";
import { useSiteContent } from "@/hooks/useSiteContent";

const gallery = [
  { src: salamImg, alt: "Jalur menuju Puncak Salam" },
  { src: homestayImg, alt: "Rumah adat berbatu tatapakan" },
  { src: hamparanImg, alt: "Hamparan kebun singkong warga" },
  { src: upacaraImg, alt: "Upacara adat warga Cireundeu" },
];

const DEFAULTS = {
  title: "Mengenal Kampung Adat Cireundeu",
  body:
    "Nama Cireundeu berasal dari pohon reundeu, tanaman herbal yang dahulu banyak tumbuh di lembah ini dan dipakai sebagai obat tradisional. Masyarakat memegang teguh ajaran leluhur yang menekankan keselarasan hidup dengan alam.",
};

const About = () => {
  const { data } = useSiteContent("about", DEFAULTS);
  return (
  <section id="tentang" className="py-20 md:py-28">
    <div className="container mx-auto grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
      <div>
        <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
          Tentang Kami
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl text-forest leading-tight font-display">
          {data.title}
        </h2>
        <div className="mt-4 h-1 w-20 bg-gold rounded-full" />

        <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed whitespace-pre-line">
          <p>{data.body}</p>
        </div>


        <div className="mt-6 flex gap-4 rounded-xl border-l-4 border-terracotta bg-terracotta/10 p-5">
          <Wheat className="h-6 w-6 shrink-0 text-terracotta mt-0.5" />
          <div>
            <p className="font-display text-lg font-semibold text-forest">
              Singkong, Identitas yang Dipilih
            </p>
            <p className="mt-1 text-sm text-foreground/80">
              Sejak tahun 1918, masyarakat Cireundeu memilih{" "}
              <strong>singkong sebagai pengganti beras</strong>. Tradisi mengonsumsi{" "}
              <em>rasi</em> (beras singkong) ini lahir sebagai bentuk kemandirian pangan dan
              kini menjadi jati diri kampung — diwariskan turun-temurun melalui dapur, ladang,
              dan upacara adat warga.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4 rounded-xl border-l-4 border-gold bg-gold/10 p-5">
          <Sparkles className="h-6 w-6 shrink-0 text-gold mt-0.5" />
          <div>
            <p className="font-display text-lg font-semibold text-forest">
              Tradisi yang Hidup di Tengah Zaman
            </p>
            <p className="mt-1 text-sm text-foreground/80">
              Cireundeu membuktikan bahwa kearifan lokal bukan benda museum — ia adalah cara
              hidup yang terus mengalir bersama generasi baru.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-forest/10 via-gold/15 to-terracotta/10 blur-xl" />
        <img
          src={salamImg}
          alt="Pemandangan Puncak Salam dari Kampung Adat Cireundeu"
          className="rounded-3xl shadow-soft w-full h-[480px] md:h-[560px] object-cover"
          loading="lazy"
        />
        <div className="absolute -bottom-6 -left-6 hidden md:block bg-cream rounded-2xl p-4 shadow-card border border-border max-w-[220px]">
          <div className="text-3xl font-display font-bold text-forest">3</div>
          <div className="text-xs uppercase tracking-wider text-terracotta">Gunung Pelindung</div>
          <div className="mt-1 text-xs text-muted-foreground">Cimenteng, Jambul, Gajahlangu</div>
        </div>
      </div>
    </div>

    <div className="container mx-auto mt-14">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {gallery.map((g) => (
          <div key={g.src} className="overflow-hidden rounded-2xl border border-border shadow-card group">
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </div>

    <SundaDivider />
  </section>
);

export default About;

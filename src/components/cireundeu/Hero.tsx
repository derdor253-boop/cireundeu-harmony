import { ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/photos/salam.png";

const Hero = () => (
  <section id="beranda" className="relative isolate overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-hero-gradient" />
    <div
      className="absolute inset-0 -z-10 opacity-40 mix-blend-overlay"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 -z-10 bg-forest/40" aria-hidden="true" />
    <div className="absolute inset-0 -z-10 bg-woven opacity-20" aria-hidden="true" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-cream" />

    <div className="container mx-auto py-24 md:py-36 text-center text-cream">
      <span className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-1.5 text-xs tracking-[0.2em] uppercase backdrop-blur">
        Leuwigajah • Cimahi Selatan • Jawa Barat
      </span>
      <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-up">
        Wilujeng Sumping di <br className="hidden md:block" />
        <span className="text-gold">Kampung Adat Cireundeu</span>
      </h1>
      <p className="mt-6 font-display italic text-xl md:text-2xl text-gold-soft">
        “Ngindung Ka Waktu, Mibapa Ka Jaman”
      </p>
      <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-cream/85 leading-relaxed">
        Kampung adat yang menjaga tradisi leluhur di tengah modernitas,
        terletak di lembah hijau Cimahi Selatan, Jawa Barat.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-ink font-semibold px-7">
          <a href="#wisata">
            Jelajahi Kampung
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-cream/70 text-cream bg-transparent hover:bg-cream hover:text-forest px-7"
        >
          <a href="#kontak">
            <CalendarCheck className="mr-1 h-4 w-4" />
            Reservasi Kunjungan
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default Hero;

import { ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/photos/salam.png";
import { useSiteContent } from "@/hooks/useSiteContent";
import MediaImage from "@/components/MediaImage";
import { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/lib/mediaUrl";

const DEFAULTS = {
  headline: "Wilujeng Sumping di Kampung Adat Cireundeu",
  subheadline:
    "Kampung adat yang menjaga tradisi leluhur di tengah modernitas, terletak di lembah hijau Cimahi Selatan, Jawa Barat.",
  badge_text: "Leuwigajah • Cimahi Selatan • Jawa Barat",
  hero_image_url: "",
  cta_primary_label: "Jelajahi Kampung",
  cta_primary_href: "#wisata",
  cta_secondary_label: "Reservasi Kunjungan",
  cta_secondary_href: "#kontak",
};

const GLOBAL_DEFAULT = { tagline: "Ngindung Ka Waktu, Mibapa Ka Jaman" };

const Hero = () => {
  const { data } = useSiteContent("hero", DEFAULTS);
  const { data: globals } = useSiteContent("global_settings", GLOBAL_DEFAULT);
  const [bg, setBg] = useState(heroBg);

  useEffect(() => {
    let alive = true;
    resolveMediaUrl(data.hero_image_url).then((url) => alive && setBg(url || heroBg));
    return () => { alive = false; };
  }, [data.hero_image_url]);

  const headline = data.headline || DEFAULTS.headline;
  const splitIdx = headline.toLowerCase().indexOf(" di ");
  const lead = splitIdx > -1 ? headline.slice(0, splitIdx + 4) : headline;
  const accent = splitIdx > -1 ? headline.slice(splitIdx + 4) : "";

  return (
    <section id="beranda" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-hero-gradient" />
      <div
        className="absolute inset-0 -z-10 opacity-40 mix-blend-overlay"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-forest/40" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-woven opacity-20" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-cream" />

      <div className="container mx-auto py-24 md:py-36 text-center text-cream">
        {data.badge_text && (
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-1.5 text-xs tracking-[0.2em] uppercase backdrop-blur">
            {data.badge_text}
          </span>
        )}
        <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-up">
          {lead}
          {accent && (
            <>
              <br className="hidden md:block" />
              <span className="text-gold">{accent}</span>
            </>
          )}
        </h1>
        {globals.tagline && (
          <p className="mt-6 font-display italic text-xl md:text-2xl text-gold-soft">
            “{globals.tagline}”
          </p>
        )}
        <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-cream/85 leading-relaxed">
          {data.subheadline}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          {data.cta_primary_label && data.cta_primary_href && (
            <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-ink font-semibold px-7">
              <a href={data.cta_primary_href}>
                {data.cta_primary_label}
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          )}
          {data.cta_secondary_label && data.cta_secondary_href && (
            <Button asChild size="lg" variant="outline"
              className="border-cream/70 text-cream bg-transparent hover:bg-cream hover:text-forest px-7">
              <a href={data.cta_secondary_href}>
                <CalendarCheck className="mr-1 h-4 w-4" />
                {data.cta_secondary_label}
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;

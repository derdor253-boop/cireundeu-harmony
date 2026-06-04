import SundaDivider from "./SundaDivider";
import salam from "@/assets/photos/salam.png";
import angklung from "@/assets/photos/angklung-buncis.png";
import upacara from "@/assets/photos/upacara-adat.png";
import hamparan from "@/assets/photos/hamparan-singkong.png";
import homestay from "@/assets/photos/homestay.png";
import pengolahan from "@/assets/photos/pengolahan-rasi.png";
import janur from "@/assets/photos/kerajinan-janur.png";
import edukasi from "@/assets/photos/edukasi.png";
import pangan from "@/assets/photos/pangan-lokal.png";
import meriam from "@/assets/photos/meriam.png";

const items = [
  { src: salam, alt: "Puncak Salam", span: "row-span-2" },
  { src: angklung, alt: "Angklung Buncis" },
  { src: upacara, alt: "Upacara adat" },
  { src: hamparan, alt: "Hamparan singkong", span: "col-span-2" },
  { src: homestay, alt: "Homestay rumah adat" },
  { src: pengolahan, alt: "Pengolahan rasi" },
  { src: janur, alt: "Kerajinan janur" },
  { src: edukasi, alt: "Edukasi budaya" },
  { src: pangan, alt: "Pangan lokal" },
  { src: meriam, alt: "Meriam Sapu Jagat" },
];

const Gallery = () => (
  <section id="galeri" className="py-20 md:py-28 bg-cream">
    <div className="container mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
          Katalog Visual
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl text-forest font-display">
          Galeri Kampung Cireundeu
        </h2>
        <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
        <p className="mt-4 text-foreground/75">
          Dokumentasi alam, budaya, dan keseharian warga adat — dari Puncak Salam hingga dapur tradisional.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-3 sm:gap-4">
        {items.map((it, i) => (
          <figure
            key={i}
            className={`group relative overflow-hidden rounded-2xl border border-border shadow-card cursor-pointer ${it.span ?? ""}`}
          >
            <img
              src={it.src}
              alt={it.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-4 text-cream text-sm font-medium translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              {it.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
    <SundaDivider />
  </section>
);

export default Gallery;

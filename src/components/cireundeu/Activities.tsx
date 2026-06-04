import { Drum, Mountain, ChefHat, Leaf, Home, Camera, GraduationCap, Sparkles, Wheat } from "lucide-react";
import SundaDivider from "./SundaDivider";
import angklungImg from "@/assets/photos/angklung-buncis.png";
import salamImg from "@/assets/photos/salam.png";
import pengolahanImg from "@/assets/photos/pengolahan-rasi.png";
import janurImg from "@/assets/photos/kerajinan-janur.png";
import homestayImg from "@/assets/photos/homestay.png";
import meriamImg from "@/assets/photos/meriam.png";
import edukasiImg from "@/assets/photos/edukasi.png";
import upacaraImg from "@/assets/photos/upacara-adat.png";
import panganImg from "@/assets/photos/pangan-lokal.png";
import hamparanImg from "@/assets/photos/hamparan-singkong.png";

const activities = [
  {
    icon: Drum,
    title: "Angklung Buncis & Gondang",
    desc: "Pertunjukan seni musik tradisional Sunda khas Cireundeu, sering ditampilkan pada upacara adat dan kunjungan tamu.",
    img: angklungImg,
  },
  {
    icon: Mountain,
    title: "Hiking ke Puncak Salam",
    desc: "Perjalanan sakral menuju puncak — wajib tanpa alas kaki, dilarang mengenakan pakaian merah, untuk menyentuh alam secara langsung.",
    img: salamImg,
  },
  {
    icon: ChefHat,
    title: "Workshop Kuliner Singkong",
    desc: "Belajar membuat rasi, cireng, kripca, hingga dendeng kulit singkong langsung dari ibu-ibu warga adat.",
    img: pengolahanImg,
  },
  {
    icon: Leaf,
    title: "Kerajinan Janur & Wayang",
    desc: "Workshop membuat kerajinan dari daun kelapa (janur) dan wayang dari daun singkong, melestarikan ketrampilan tangan tradisional.",
    img: janurImg,
  },
  {
    icon: Home,
    title: "Homestay Rumah Adat",
    desc: "Menginap di rumah warga dan merasakan langsung kehidupan adat — mulai dari pagi di dapur tungku hingga obrolan malam di balai.",
    img: homestayImg,
  },
  {
    icon: Camera,
    title: "Situs Meriam Sapu Jagat",
    desc: "Landmark bersejarah di gerbang masuk yang menyimpan Wangsit Siliwangi — saksi bisu perjalanan panjang kampung adat.",
    img: meriamImg,
  },
  {
    icon: GraduationCap,
    title: "Edukasi Budaya",
    desc: "Program belajar bersama sesepuh adat untuk pelajar dan komunitas — mengenal angklung, bahasa, dan filosofi Sunda.",
    img: edukasiImg,
  },
  {
    icon: Sparkles,
    title: "Upacara Adat",
    desc: "Menyaksikan upacara adat seperti Tutup Taun, Ngemban Taun, dan ritual syukuran panen yang sakral dan penuh makna.",
    img: upacaraImg,
  },
  {
    icon: Wheat,
    title: "Hamparan Singkong & Pangan Lokal",
    desc: "Berjalan menyusuri ladang singkong warga dan mencicipi sajian pangan lokal langsung dari dapur tradisional.",
    img: hamparanImg,
  },
];



const Activities = () => (
  <section id="wisata" className="py-20 md:py-28">
    <div className="container mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
          Wisata & Aktivitas
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl text-forest">
          Pengalaman Otentik di Tanah Adat
        </h2>
        <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
        <p className="mt-4 text-foreground/75">
          Beragam aktivitas budaya, kuliner, dan spiritual yang dapat Anda ikuti bersama warga.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map(({ icon: Icon, title, desc, img }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-gold hover:shadow-soft transition-all flex flex-col"
          >
            <div className="overflow-hidden aspect-[4/3] bg-muted">
              <img
                src={img}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <span className="inline-grid h-12 w-12 place-items-center rounded-lg bg-terracotta/10 text-terracotta group-hover:bg-terracotta group-hover:text-cream transition-colors">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl text-forest">{title}</h3>
              <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
    <SundaDivider />
  </section>
);

export default Activities;

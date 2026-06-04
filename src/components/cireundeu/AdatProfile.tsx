import { Sprout, Users, AlertTriangle, GraduationCap, Home, Wifi, Stethoscope } from "lucide-react";
import SundaDivider from "./SundaDivider";
import { useSiteContent } from "@/hooks/useSiteContent";

const rules = [
  "Dilarang menggunakan pakaian berwarna merah di area Puncak Salam",
  "Wajib melepas alas kaki di kawasan sakral",
  "Reservasi wajib untuk paket wisata",
  "Hormati hukum adat yang berlaku selama berkunjung",
];

const HISTORY_DEFAULT = {
  title: "Sejarah & Profil Adat Cireundeu",
  body: "Tradisi mengonsumsi rasi dimulai sejak masa Mama Ali, sebagai bentuk perlawanan terhadap monopoli beras dan komitmen terhadap kemandirian pangan. Hingga kini nilai-nilai itu terus dijaga.",
};

const AdatProfile = () => {
  const { data: history } = useSiteContent("history", HISTORY_DEFAULT);
  return (
  <section id="profil-adat" className="py-20 md:py-28 bg-warm-gradient">
    <div className="container mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
          Profil Adat
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl text-forest">{history.title}</h2>
        <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
        <p className="mt-6 text-foreground/80 leading-relaxed whitespace-pre-line text-left md:text-center">
          {history.body}
        </p>
      </div>


      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl bg-card border border-border p-7 shadow-card">
          <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-forest text-cream">
            <Sprout className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-display text-2xl text-forest">Kepercayaan Sunda Wiwitan</h3>
          <p className="mt-3 text-foreground/80 leading-relaxed">
            Sunda Wiwitan adalah ajaran leluhur masyarakat Sunda yang menempatkan
            <strong> alam sebagai guru</strong>. Hidup dijalani dengan prinsip keseimbangan —
            antara manusia, alam, dan Sang Pencipta. Empat warna dasar (merah, kuning, hitam,
            putih) menjadi simbol unsur kehidupan yang harus selalu dijaga harmoninya.
          </p>
        </article>

        <article className="rounded-2xl bg-card border border-border p-7 shadow-card">
          <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-terracotta text-cream">
            <Users className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-display text-2xl text-forest">Tata Kelola Adat</h3>
          <p className="mt-3 text-foreground/80 leading-relaxed">
            Kepemimpinan adat dipegang oleh <strong>sesepuh (Abah & Ambu)</strong> yang menjadi
            penjaga ajaran dan pengambil keputusan musyawarah. Setiap tamu yang datang akan
            disambut dan dijelaskan adat istiadat yang berlaku, sebagai bentuk penghormatan
            timbal-balik antara warga dan pengunjung.
          </p>
        </article>
      </div>

      <div className="mt-10 rounded-2xl border-2 border-dashed border-terracotta/50 bg-terracotta/5 p-7">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-7 w-7 text-terracotta shrink-0" />
          <div className="flex-1">
            <h3 className="font-display text-2xl text-terracotta">Aturan Kunjungan</h3>
            <p className="mt-1 text-sm text-foreground/75">
              Mohon dipahami dan dipatuhi sebagai bentuk penghormatan kepada adat istiadat:
            </p>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {rules.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-terracotta" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fasilitas Desa */}
      <div className="mt-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
            Fasilitas Desa
          </span>
          <h3 className="mt-2 text-2xl md:text-3xl font-display text-forest">
            Sarana di Kawasan Cireundeu
          </h3>
          <div className="mt-3 mx-auto h-1 w-16 bg-gold rounded-full" />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: GraduationCap,
              title: "Sekolah Dasar (SD)",
              desc: "Tersedia fasilitas pendidikan dasar di kawasan Desa Cireundeu, mendukung akses belajar bagi anak-anak warga adat.",
            },
            {
              icon: Home,
              title: "Homestay Warga",
              desc: "Rumah-rumah warga yang membuka diri sebagai penginapan ramah tamu untuk pengunjung.",
            },
            {
              icon: Stethoscope,
              title: "Posyandu & Layanan Kesehatan",
              desc: "Akses layanan kesehatan dasar bagi warga melalui posyandu desa.",
            },
            {
              icon: Wifi,
              title: "Jaringan Komunikasi",
              desc: "Konektivitas seluler tersedia untuk mendukung aktivitas warga dan tamu.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="group rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all"
            >
              <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-forest/10 text-forest group-hover:bg-forest group-hover:text-cream transition-colors">
                <Icon className="h-5 w-5" />
              </span>
              <h4 className="mt-4 font-display text-lg text-forest leading-snug">{title}</h4>
              <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
    <SundaDivider />
  </section>
  );
};


export default AdatProfile;

import SundaDivider from "./SundaDivider";
import rasiImg from "@/assets/cuisine/rasi-goreng.jpeg";
import dendengImg from "@/assets/cuisine/dendeng.jpg";
import kripcaImg from "@/assets/cuisine/kripca.jpg";
import eggrollImg from "@/assets/cuisine/eggroll.jpg";
import cirengImg from "@/assets/cuisine/cireng.jpg";
import sarojaImg from "@/assets/cuisine/saroja.jpg";

const dishes = [
  {
    name: "Rasi (Beras Singkong)",
    desc: "Makanan pokok pengganti nasi. Diolah dari singkong fermentasi, tekstur pulen, kaya serat.",
    img: rasiImg,
  },
  {
    name: "Dendeng Kulit Singkong",
    desc: "Camilan khas yang renyah dan gurih, terbuat dari kulit singkong pilihan.",
    img: dendengImg,
  },
  {
    name: "Kripik Kaca (Kripca)",
    desc: "Keripik tipis bening khas Cireundeu — renyah, gurih, dan kini jadi oleh-oleh favorit.",
    img: kripcaImg,
  },
  {
    name: "Egg Roll Singkong",
    desc: "Jajanan manis tradisional bertekstur ringan, cocok untuk teman teh sore.",
    img: eggrollImg,
  },
  {
    name: "Cireng",
    desc: "Adonan singkong goreng yang gurih di luar, kenyal di dalam, ikon jajanan Sunda.",
    img: cirengImg,
  },
  {
    name: "Saroja",
    desc: "Kue kembang goreng berbahan dasar singkong — renyah, manis legit, dan klasik.",
    img: sarojaImg,
  },
];

const Cuisine = () => (
  <section id="kuliner" className="py-20 md:py-28 bg-warm-gradient">
    <div className="container mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
          Kuliner Khas
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl text-forest">
          Cita Rasa Adat dari Tanah Cireundeu
        </h2>
        <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
        <p className="mt-4 text-foreground/75">
          Olahan singkong yang menjadi nadi dapur masyarakat — sederhana, bergizi, dan penuh warisan.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((d) => (
          <article
            key={d.name}
            className="group overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
          >
            <div className="overflow-hidden aspect-[4/3] bg-muted">
              <img
                src={d.img}
                alt={d.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl text-forest">{d.name}</h3>
              <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{d.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
    <SundaDivider />
  </section>
);

export default Cuisine;

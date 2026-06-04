import { Instagram, Facebook, MessageCircle, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";

const WHATSAPP_URL = "https://wa.me/6281200000000";
const INSTAGRAM_URL = "https://instagram.com/kampungadatcireundeu";
const FACEBOOK_URL = "https://facebook.com/kampungadatcireundeu";

const links = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Tentang Kami" },
  { href: "#sejarah", label: "Jejak Waktu" },
  { href: "#profil-adat", label: "Kepercayaan & Tata Kelola" },
  { href: "#kuliner", label: "Kuliner Khas" },
  { href: "#wisata", label: "Wisata & Aktivitas" },
  { href: "#kontak", label: "Reservasi & Kontak" },
];

const socials = [
  { Icon: Instagram, label: "Instagram", href: INSTAGRAM_URL },
  { Icon: Facebook, label: "Facebook", href: FACEBOOK_URL },
  { Icon: MessageCircle, label: "WhatsApp", href: WHATSAPP_URL },
];

const Footer = () => (
  <footer className="bg-forest text-cream relative overflow-hidden">
    <div className="absolute inset-0 bg-woven opacity-25" aria-hidden="true" />
    <div className="container mx-auto relative py-16">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <a href="#beranda" className="flex items-center gap-3">
            <Logo className="h-12 w-12 rounded-full" />
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold text-cream">Kampung Adat</span>
              <span className="block font-display text-sm tracking-wide text-gold">Cireundeu</span>
            </span>
          </a>
          <p className="mt-5 font-display italic text-lg text-gold">
            “Ngindung Ka Waktu, Mibapa Ka Jaman”
          </p>
          <p className="mt-3 max-w-md text-sm text-cream/75 leading-relaxed">
            Kampung adat yang menjaga tradisi leluhur di tengah modernitas — terbuka
            menerima tamu yang datang dengan hormat dan rasa ingin belajar.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full bg-cream/10 hover:bg-gold hover:text-ink transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold">Navigasi</h4>
          <ul className="mt-4 space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-cream/80 hover:text-gold transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold">Kontak</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>Kp. Cireundeu, Leuwigajah, Cimahi Selatan, Jawa Barat 40532</span>
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <a href="tel:+6281200000000" className="hover:text-gold transition-colors">
                +62 812-0000-0000
              </a>
            </li>
            <li className="flex gap-2">
              <MessageCircle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                Chat WhatsApp Sekretariat
              </a>
            </li>
            <li className="flex gap-2">
              <Instagram className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                @kampungadatcireundeu
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-cream/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/60">
        <p>© 2025 Kampung Adat Cireundeu — Leuwigajah, Cimahi Selatan</p>
        <p>Dibangun dengan hormat kepada karuhun & alam.</p>
      </div>
    </div>
  </footer>
);

export default Footer;

import { useEffect, useState } from "react";
import { ChevronDown, Instagram, Menu, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import logoDiktisaintek from "@/assets/logos/diktisaintek.png";
import logoTelkom from "@/assets/logos/telkom-university.png";
import logoDirektorat from "@/assets/logos/direktorat-akademik.jpeg";
import logoBPA from "@/assets/logos/bpa.png";
import logoJulang from "@/assets/logos/julang-ngapak.png";
import logoKKN from "@/assets/logos/kkn-cireundeu.png";

const partnerLogos = [
  { src: logoDiktisaintek, label: "Diktisaintek Berdampak" },
  { src: logoTelkom, label: "Telkom University" },
  { src: logoDirektorat, label: "Direktorat Akademik" },
  { src: logoBPA, label: "BPA" },
  { src: logoJulang, label: "Kampung Adat Cireundeu" },
  { src: logoKKN, label: "Komunitas Cireundeu" },
];

const WHATSAPP_URL = "https://wa.me/6281200000000";
const INSTAGRAM_URL = "https://instagram.com/kampungadatcireundeu";

type NavItem =
  | { href: string; label: string }
  | {
      label: string;
      children: { href: string; label: string }[];
    };

const navItems: NavItem[] = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Tentang Kami" },
  {
    label: "Sejarah & Profil Adat",
    children: [
      { href: "#sejarah", label: "Jejak Waktu" },
      { href: "#profil-adat", label: "Kepercayaan & Tata Kelola" },
    ],
  },
  { href: "#kuliner", label: "Kuliner Khas" },
  { href: "#wisata", label: "Wisata & Aktivitas" },
  { href: "#kontak", label: "Reservasi & Kontak" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-soft border-b border-border"
          : "bg-cream/70 backdrop-blur-sm"
      }`}
    >
      {/* Partner logos strip - 6 mitra (compact, logo only) */}
      <div className="border-b border-border/50 bg-cream/90">
        <div className="container mx-auto py-1.5 sm:py-2">
          <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 md:gap-x-9 gap-y-1.5">
            {partnerLogos.map((p) => (
              <img
                key={p.label}
                src={p.src}
                alt={p.label}
                title={p.label}
                draggable={false}
                loading="lazy"
                className="h-6 sm:h-7 md:h-8 w-auto object-contain select-none opacity-90 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto flex items-center justify-between py-3 gap-4">
        <a href="#beranda" className="flex items-center gap-2.5 group shrink-0">
          <Logo className="h-11 w-11 shadow-soft rounded-full group-hover:rotate-6 transition-transform" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-forest">Kampung Adat</span>
            <span className="block font-display text-sm tracking-wide text-terracotta">Cireundeu</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) =>
            "children" in item ? (
              <div key={item.label} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-forest hover:bg-muted rounded-md transition-colors"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 top-full pt-2 transition-all">
                  <div className="min-w-[240px] rounded-lg border border-border bg-cream shadow-soft py-2">
                    {item.children.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-forest transition-colors"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-forest hover:bg-muted rounded-md transition-colors"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Kampung Adat Cireundeu"
            className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest hover:text-cream transition-colors"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>

        <button
          aria-label="Buka menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden grid h-10 w-10 place-items-center rounded-md text-forest hover:bg-muted"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-cream">
          <div className="container mx-auto py-3 flex flex-col">
            {navItems.map((item) =>
              "children" in item ? (
                <div key={item.label} className="border-b border-border/60">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileDropdown((d) => (d === item.label ? null : item.label))
                    }
                    className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-foreground/80 hover:text-forest"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileDropdown === item.label && (
                    <div className="pl-4 pb-2 flex flex-col">
                      {item.children.map((c) => (
                        <a
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="py-2 text-sm text-foreground/75 hover:text-forest"
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-sm font-medium text-foreground/80 hover:text-forest border-b border-border/60"
                >
                  {item.label}
                </a>
              ),
            )}
            <div className="mt-3 flex gap-2">
              <Button asChild variant="outline" className="flex-1 border-forest text-forest">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                  <Instagram className="mr-1 h-4 w-4" /> Instagram
                </a>
              </Button>
              <Button asChild className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                  <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

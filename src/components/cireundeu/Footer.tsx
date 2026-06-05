import { Instagram, Facebook, MessageCircle, MapPin, Phone, Youtube } from "lucide-react";
import Logo from "./Logo";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const FOOTER_DEFAULT = {
  tagline:
    "Kampung adat yang menjaga tradisi leluhur di tengah modernitas — terbuka menerima tamu yang datang dengan hormat dan rasa ingin belajar.",
  copyright: "© 2025 Kampung Adat Cireundeu — Leuwigajah, Cimahi Selatan",
  footnote: "Dibangun dengan hormat kepada karuhun & alam.",
};

const CONTACT_DEFAULT = {
  address: "Kp. Cireundeu, Leuwigajah, Cimahi Selatan, Jawa Barat 40532",
};

const GLOBAL_DEFAULT = {
  site_name: "Kampung Adat Cireundeu",
  tagline: "Ngindung Ka Waktu, Mibapa Ka Jaman",
};

const NAV_DEFAULT = { items: [] as { label: string; href: string; active: boolean; external?: boolean }[] };

const Footer = () => {
  const { data: footer } = useSiteContent("footer", FOOTER_DEFAULT);
  const { data: contact } = useSiteContent("contact_info", CONTACT_DEFAULT);
  const { data: globals } = useSiteContent("global_settings", GLOBAL_DEFAULT);
  const { data: nav } = useSiteContent("navigation", NAV_DEFAULT);
  const wa = useWhatsApp();
  const social = useSocialLinks();

  const socials = [
    social.instagram.active && social.instagram.url
      ? { Icon: Instagram, label: "Instagram", href: social.instagram.url }
      : null,
    social.facebook.active && social.facebook.url
      ? { Icon: Facebook, label: "Facebook", href: social.facebook.url }
      : null,
    social.youtube.active && social.youtube.url
      ? { Icon: Youtube, label: "YouTube", href: social.youtube.url }
      : null,
    wa.enabled
      ? { Icon: MessageCircle, label: "WhatsApp", href: wa.buildLink("footer") }
      : null,
  ].filter(Boolean) as { Icon: any; label: string; href: string }[];

  const navItems = (nav.items ?? []).filter((i) => i.active);
  const siteName = globals.site_name || "Kampung Adat Cireundeu";

  return (
    <footer className="bg-forest text-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-woven opacity-25" aria-hidden="true" />
      <div className="container mx-auto relative py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a href="#beranda" className="flex items-center gap-3">
              <Logo className="h-12 w-12 rounded-full" />
              <span className="leading-tight">
                <span className="block font-display text-xl font-bold text-cream">{siteName}</span>
                {globals.tagline && (
                  <span className="block font-display text-sm tracking-wide text-gold">{globals.tagline}</span>
                )}
              </span>
            </a>
            <p className="mt-5 max-w-md text-sm text-cream/75 leading-relaxed">{footer.tagline}</p>
            {socials.length > 0 && (
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
            )}
          </div>

          <div>
            <h4 className="font-display text-lg text-gold">Navigasi</h4>
            <ul className="mt-4 space-y-2">
              {navItems.map((l, i) => (
                <li key={i}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-cream/80 hover:text-gold transition-colors"
                  >
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
                <span>{contact.address}</span>
              </li>
              {wa.enabled && (
                <li className="flex gap-2">
                  <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <a href={wa.buildLink("footer")} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                    {wa.display || wa.number}
                  </a>
                </li>
              )}
              {social.instagram.active && social.instagram.url && (
                <li className="flex gap-2">
                  <Instagram className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/60">
          <p>{footer.copyright}</p>
          <p>{footer.footnote}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

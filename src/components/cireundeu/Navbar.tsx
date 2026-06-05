import { useEffect, useState } from "react";
import { Instagram, Menu, MessageCircle, Facebook, Youtube, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useMediaAssets } from "@/hooks/useMediaAssets";
import { resolveMediaUrl } from "@/lib/mediaUrl";

import logoDiktisaintek from "@/assets/logos/diktisaintek.png";
import logoTelkom from "@/assets/logos/telkom-university.png";
import logoDirektorat from "@/assets/logos/direktorat-akademik.jpeg";
import logoBPA from "@/assets/logos/bpa.png";
import logoJulang from "@/assets/logos/julang-ngapak.png";
import logoKKN from "@/assets/logos/kkn-cireundeu.png";

const FALLBACK_PARTNERS = [
  { name: "Diktisaintek Berdampak", src: logoDiktisaintek, link: "" },
  { name: "Telkom University", src: logoTelkom, link: "https://telkomuniversity.ac.id" },
  { name: "Direktorat Akademik", src: logoDirektorat, link: "" },
  { name: "BPA", src: logoBPA, link: "" },
  { name: "Julang Ngapak", src: logoJulang, link: "" },
  { name: "KKN Cireundeu", src: logoKKN, link: "" },
];

const NAV_DEFAULT = {
  items: [
    { label: "Beranda", href: "#beranda", active: true, external: false },
    { label: "Tentang Kami", href: "#tentang", active: true, external: false },
    { label: "Kuliner Khas", href: "#kuliner", active: true, external: false },
    { label: "Wisata & Aktivitas", href: "#wisata", active: true, external: false },
    { label: "Reservasi & Kontak", href: "#kontak", active: true, external: false },
  ],
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: nav } = useSiteContent("navigation", NAV_DEFAULT);
  const { data: globals } = useSiteContent("global_settings", { site_name: "Kampung Adat", tagline: "Cireundeu" });
  const wa = useWhatsApp();
  const social = useSocialLinks();
  const { items: partnersDb } = useMediaAssets("partners");
  const [partnerUrls, setPartnerUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all(
      partnersDb.map(async (p) => [p.id, (await resolveMediaUrl(p.image_url)) ?? ""] as const),
    ).then((entries) => {
      if (!alive) return;
      setPartnerUrls(Object.fromEntries(entries));
    });
    return () => { alive = false; };
  }, [partnersDb]);

  const items = (nav.items ?? []).filter((i: any) => i.active);

  // Build partner list: prefer DB items with image, else fallback static
  const partners = (() => {
    const dbActive = partnersDb.filter((p) => p.active);
    if (dbActive.length === 0) return FALLBACK_PARTNERS;
    return dbActive.map((p, i) => ({
      name: p.name,
      src: partnerUrls[p.id] || FALLBACK_PARTNERS[i]?.src || "",
      link: p.link_url || "",
      target: p.target,
    }));
  })();

  const siteName = globals.site_name || "Kampung Adat";
  const tagline = globals.tagline || "Cireundeu";
  const [nameLead, nameAccent] = (() => {
    const parts = siteName.split(" ");
    if (parts.length <= 1) return [siteName, ""];
    return [parts.slice(0, -1).join(" "), parts.slice(-1).join(" ")];
  })();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-soft border-b border-border"
          : "bg-cream/70 backdrop-blur-sm"
      }`}
    >
      {partners.length > 0 && (
        <div className="border-b border-border/50 bg-cream/90">
          <div className="container mx-auto py-1.5 sm:py-2">
            <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 md:gap-x-9 gap-y-1.5">
              {partners.map((p, i) => {
                if (!p.src) return null;
                const img = (
                  <img
                    src={p.src}
                    alt={p.name}
                    title={p.name}
                    draggable={false}
                    loading="lazy"
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain select-none opacity-90 hover:opacity-100 transition-opacity"
                  />
                );
                return p.link ? (
                  <a key={i} href={p.link} target={(p as any).target ?? "_blank"} rel="noopener noreferrer">
                    {img}
                  </a>
                ) : (
                  <span key={i}>{img}</span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto flex items-center justify-between py-3 gap-4">
        <a href="#beranda" className="flex items-center gap-2.5 group shrink-0">
          <Logo className="h-11 w-11 shadow-soft rounded-full group-hover:rotate-6 transition-transform" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-forest">{nameLead}</span>
            <span className="block font-display text-sm tracking-wide text-terracotta">
              {nameAccent || tagline}
            </span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {items.map((item: any, i: number) => (
            <a
              key={i}
              href={item.href || "#"}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-forest hover:bg-muted rounded-md transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {social.instagram.active && social.instagram.url && (
            <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest hover:text-cream transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          )}
          {social.facebook.active && social.facebook.url && (
            <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest hover:text-cream transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
          )}
          {social.youtube.active && social.youtube.url && (
            <a href={social.youtube.url} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
              className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest hover:text-cream transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
          )}
          {wa.enabled && (
            <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white">
              <a href={wa.link} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
              </a>
            </Button>
          )}
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
            {items.map((item: any, i: number) => (
              <a
                key={i}
                href={item.href || "#"}
                onClick={() => setOpen(false)}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="py-2.5 text-sm font-medium text-foreground/80 hover:text-forest border-b border-border/60"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 flex gap-2 flex-wrap">
              {social.instagram.active && social.instagram.url && (
                <Button asChild variant="outline" className="flex-1 border-forest text-forest">
                  <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                    <Instagram className="mr-1 h-4 w-4" /> Instagram
                  </a>
                </Button>
              )}
              {wa.enabled && (
                <Button asChild className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white">
                  <a href={wa.link} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                    <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

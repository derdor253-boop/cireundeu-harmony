import { useSiteContent } from "./useSiteContent";

const DEFAULTS = {
  number: "6281200000000",
  display: "+62 812-0000-0000",
  default_message: "Halo, saya ingin bertanya tentang Kampung Adat Cireundeu.",
  hero_message: "",
  reservation_message: "",
  footer_message: "",
};

export type WaContext = "default" | "hero" | "reservation" | "footer";

export function useWhatsApp() {
  const { data } = useSiteContent("whatsapp", DEFAULTS);

  const buildLink = (ctx: WaContext = "default", customMessage?: string) => {
    const number = (data.number || "").replace(/\D/g, "");
    if (!number) return "";
    const msg =
      customMessage ??
      ((ctx === "hero" && data.hero_message) ||
        (ctx === "reservation" && data.reservation_message) ||
        (ctx === "footer" && data.footer_message) ||
        data.default_message ||
        "");
    const q = msg ? `?text=${encodeURIComponent(msg)}` : "";
    return `https://wa.me/${number}${q}`;
  };

  return {
    number: data.number,
    display: data.display,
    link: buildLink(),
    buildLink,
    enabled: Boolean((data.number || "").replace(/\D/g, "")),
  };
}

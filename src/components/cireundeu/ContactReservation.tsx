import { useState } from "react";
import { z } from "zod";
import { MapPin, Phone, Clock, Send, Navigation, Instagram, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { useSocialLinks } from "@/hooks/useSocialLinks";

type Pkg = { value: string; label: string };
const RES_DEFAULT = {
  title: "Reservasi & Hubungi Kami",
  eyebrow: "Lokasi & Kontak",
  form_title: "Formulir Reservasi",
  form_subtitle: "Isi data berikut, tim kami akan menghubungi Anda untuk konfirmasi.",
  packages: [] as Pkg[],
};

const CONTACT_DEFAULT = {
  address: "Kp. Cireundeu, Leuwigajah, Cimahi Selatan, Jawa Barat 40532",
  access: "",
  hours: "",
  phone_display: "",
  maps_embed_url: "https://www.google.com/maps?q=Kampung+Adat+Cireundeu&output=embed",
};

const schema = z.object({
  nama: z.string().trim().min(2).max(100),
  institusi: z.string().trim().min(2).max(150),
  jumlah: z.coerce.number().int().min(1).max(500),
  tanggal: z.string().min(1),
  paket: z.string().min(1),
  whatsapp: z.string().trim().min(8).max(20).regex(/^[+0-9\s-]+$/),
  pesan: z.string().trim().max(1000).optional().or(z.literal("")),
});

const ContactReservation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { data: res } = useSiteContent("reservation_form", RES_DEFAULT);
  const { data: contact } = useSiteContent("contact_info", CONTACT_DEFAULT);
  const wa = useWhatsApp();
  const social = useSocialLinks();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      toast.error("Mohon periksa kembali formulir Anda.");
      return;
    }
    setErrors({});
    setSubmitting(true);

    // Open WhatsApp directly so the team gets the reservation
    const v = parsed.data;
    const msg = `Reservasi Cireundeu:%0A• Nama: ${v.nama}%0A• Institusi: ${v.institusi}%0A• Jumlah: ${v.jumlah}%0A• Tanggal: ${v.tanggal}%0A• Paket: ${v.paket}%0A• WA: ${v.whatsapp}%0A• Pesan: ${v.pesan || "-"}`;
    if (wa.enabled) {
      const url = `${wa.buildLink("reservation")}${wa.buildLink("reservation").includes("?") ? "&" : "?"}text=${msg}`;
      window.open(`https://wa.me/${wa.number.replace(/\D/g, "")}?text=${msg}`, "_blank");
    }
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Reservasi terkirim!", { description: "Tim kampung akan menghubungi Anda via WhatsApp." });
    }, 500);
  };

  const infoList = [
    { icon: MapPin, title: "Alamat", body: contact.address },
    contact.access ? { icon: Navigation, title: "Akses", body: contact.access } : null,
    contact.hours ? { icon: Clock, title: "Jam Operasional", body: contact.hours } : null,
    wa.enabled
      ? { icon: Phone, title: "Kontak", body: `WhatsApp: ${contact.phone_display || wa.display}` }
      : null,
  ].filter(Boolean) as { icon: any; title: string; body: string }[];

  return (
    <section id="kontak" className="py-20 md:py-28 bg-warm-gradient">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">{res.eyebrow}</span>
          <h2 className="mt-3 text-3xl md:text-4xl text-forest">{res.title}</h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            {contact.maps_embed_url && (
              <div className="overflow-hidden rounded-2xl border border-border shadow-card">
                <iframe
                  title="Peta Kampung Adat Cireundeu"
                  src={contact.maps_embed_url}
                  className="w-full h-72 md:h-80"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}

            <ul className="space-y-4">
              {infoList.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4 rounded-xl bg-card border border-border p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-forest/10 text-forest">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-display font-semibold text-forest">{title}</div>
                    <div className="text-sm text-foreground/75">{body}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-3">
              {wa.enabled && (
                <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-12">
                  <a href={wa.buildLink("default")} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" /> Chat WhatsApp
                  </a>
                </Button>
              )}
              {social.instagram.active && social.instagram.url && (
                <Button asChild variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-cream h-12">
                  <a href={social.instagram.url} target="_blank" rel="noopener noreferrer">
                    <Instagram className="mr-2 h-5 w-5" /> Instagram
                  </a>
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-soft">
            <h3 className="font-display text-2xl text-forest">{res.form_title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{res.form_subtitle}</p>

            <div className="mt-6 grid gap-4">
              <div>
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input id="nama" name="nama" placeholder="cth. Aki Sumarna" maxLength={100} />
                {errors.nama && <p className="mt-1 text-xs text-destructive">Wajib diisi (min. 2 karakter)</p>}
              </div>
              <div>
                <Label htmlFor="institusi">Asal Institusi / Sekolah / Keluarga</Label>
                <Input id="institusi" name="institusi" placeholder="cth. SMA Negeri 1 Cimahi" maxLength={150} />
                {errors.institusi && <p className="mt-1 text-xs text-destructive">Wajib diisi</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="jumlah">Jumlah Peserta</Label>
                  <Input id="jumlah" name="jumlah" type="number" min={1} max={500} />
                  {errors.jumlah && <p className="mt-1 text-xs text-destructive">Minimal 1</p>}
                </div>
                <div>
                  <Label htmlFor="tanggal">Tanggal Kunjungan</Label>
                  <Input id="tanggal" name="tanggal" type="date" />
                  {errors.tanggal && <p className="mt-1 text-xs text-destructive">Pilih tanggal</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="paket">Pilihan Paket</Label>
                <Select name="paket">
                  <SelectTrigger id="paket">
                    <SelectValue placeholder="Pilih paket wisata" />
                  </SelectTrigger>
                  <SelectContent>
                    {(res.packages ?? []).map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paket && <p className="mt-1 text-xs text-destructive">Pilih paket</p>}
              </div>
              <div>
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" placeholder="cth. +62 812-3456-7890" maxLength={20} />
                {errors.whatsapp && <p className="mt-1 text-xs text-destructive">Nomor tidak valid</p>}
              </div>
              <div>
                <Label htmlFor="pesan">Pesan (opsional)</Label>
                <Textarea id="pesan" name="pesan" rows={4} maxLength={1000} />
              </div>
              <Button type="submit" disabled={submitting} className="mt-2 bg-forest hover:bg-forest-light text-cream font-semibold" size="lg">
                <Send className="mr-1 h-4 w-4" />
                {submitting ? "Mengirim..." : "Kirim Reservasi"}
              </Button>
              {!wa.enabled && (
                <p className="text-xs text-muted-foreground">
                  Nomor WhatsApp pengelola belum diatur — reservasi tidak dapat diteruskan otomatis.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactReservation;

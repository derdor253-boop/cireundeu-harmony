import { useState } from "react";
import { z } from "zod";
import { MapPin, Phone, Clock, Send, Navigation, Instagram, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WHATSAPP_URL = "https://wa.me/6281200000000";
const INSTAGRAM_URL = "https://instagram.com/kampungadatcireundeu";

const schema = z.object({
  nama: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  institusi: z.string().trim().min(2, "Wajib diisi").max(150),
  jumlah: z.coerce.number().int().min(1, "Minimal 1 peserta").max(500),
  tanggal: z.string().min(1, "Pilih tanggal kunjungan"),
  paket: z.string().min(1, "Pilih paket"),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp tidak valid")
    .max(20)
    .regex(/^[+0-9\s-]+$/, "Hanya angka, +, -, dan spasi"),
  pesan: z.string().trim().max(1000).optional().or(z.literal("")),
});

const ContactReservation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      toast.error("Mohon periksa kembali formulir Anda.");
      return;
    }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Reservasi terkirim!", {
        description: "Tim kampung akan menghubungi Anda via WhatsApp dalam 1×24 jam.",
      });
    }, 700);
  };

  return (
    <section id="kontak" className="py-20 md:py-28 bg-warm-gradient">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold">
            Lokasi & Kontak
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl text-forest">Reservasi & Hubungi Kami</h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-gold rounded-full" />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Map + info */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border shadow-card">
              <iframe
                title="Peta Kampung Adat Cireundeu"
                src="https://www.google.com/maps?q=Kampung+Adat+Cireundeu,+Leuwigajah,+Cimahi+Selatan&output=embed"
                className="w-full h-72 md:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <ul className="space-y-4">
              {[
                {
                  icon: MapPin,
                  title: "Alamat",
                  body: "Kp. Cireundeu, Leuwigajah, Kec. Cimahi Selatan, Kota Cimahi, Jawa Barat 40532",
                },
                {
                  icon: Navigation,
                  title: "Akses",
                  body: "7,2 km dari Alun-alun Cimahi · 18 km (~45 menit) dari Terminal Leuwipanjang",
                },
                {
                  icon: Clock,
                  title: "Jam Operasional",
                  body: "Setiap hari, 24 jam (reservasi paket: pagi hari direkomendasikan)",
                },
                {
                  icon: Phone,
                  title: "Kontak",
                  body: "WhatsApp: +62 812-0000-0000 (Sekretariat Adat)",
                },
              ].map(({ icon: Icon, title, body }) => (
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
              <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-12">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-cream h-12">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" />
                  Instagram
                </a>
              </Button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-soft"
          >
            <h3 className="font-display text-2xl text-forest">Formulir Reservasi</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Isi data berikut, tim kami akan menghubungi Anda untuk konfirmasi.
            </p>

            <div className="mt-6 grid gap-4">
              <div>
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input id="nama" name="nama" placeholder="cth. Aki Sumarna" maxLength={100} />
                {errors.nama && <p className="mt-1 text-xs text-destructive">{errors.nama}</p>}
              </div>

              <div>
                <Label htmlFor="institusi">Asal Institusi / Sekolah / Keluarga</Label>
                <Input id="institusi" name="institusi" placeholder="cth. SMA Negeri 1 Cimahi" maxLength={150} />
                {errors.institusi && <p className="mt-1 text-xs text-destructive">{errors.institusi}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="jumlah">Jumlah Peserta</Label>
                  <Input id="jumlah" name="jumlah" type="number" min={1} max={500} placeholder="cth. 25" />
                  {errors.jumlah && <p className="mt-1 text-xs text-destructive">{errors.jumlah}</p>}
                </div>
                <div>
                  <Label htmlFor="tanggal">Tanggal Kunjungan</Label>
                  <Input id="tanggal" name="tanggal" type="date" />
                  {errors.tanggal && <p className="mt-1 text-xs text-destructive">{errors.tanggal}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="paket">Pilihan Paket</Label>
                <Select name="paket">
                  <SelectTrigger id="paket">
                    <SelectValue placeholder="Pilih paket wisata" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="setengah-hari">Paket Setengah Hari (2 aktivitas)</SelectItem>
                    <SelectItem value="satu-hari">Paket Satu Hari (3 aktivitas)</SelectItem>
                    <SelectItem value="menginap">Paket Menginap (Homestay)</SelectItem>
                    <SelectItem value="konsultasi">Konsultasi dulu</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paket && <p className="mt-1 text-xs text-destructive">{errors.paket}</p>}
              </div>

              <div>
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" placeholder="cth. +62 812-3456-7890" maxLength={20} />
                {errors.whatsapp && <p className="mt-1 text-xs text-destructive">{errors.whatsapp}</p>}
              </div>

              <div>
                <Label htmlFor="pesan">Pesan (opsional)</Label>
                <Textarea id="pesan" name="pesan" rows={4} maxLength={1000} placeholder="Aktivitas khusus yang diinginkan, kebutuhan diet, dll." />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="mt-2 bg-forest hover:bg-forest-light text-cream font-semibold"
                size="lg"
              >
                <Send className="mr-1 h-4 w-4" />
                {submitting ? "Mengirim..." : "Kirim Reservasi"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactReservation;

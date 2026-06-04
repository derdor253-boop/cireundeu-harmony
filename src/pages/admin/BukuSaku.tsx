import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageHeader from "@/components/admin/PageHeader";

const sections = [
  { id: "pendahuluan", label: "A. Pendahuluan" },
  { id: "domain", label: "B. Karakteristik Domain" },
  { id: "pemeliharaan", label: "C. Pemeliharaan Website" },
  { id: "dashboard", label: "D. Penggunaan Dashboard" },
  { id: "konten", label: "E. Manajemen Konten Dasar" },
  { id: "keamanan", label: "F. Keamanan Akun Admin" },
];

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-20">
    <h2 className="font-display text-xl font-semibold text-forest sm:text-2xl">{title}</h2>
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">{children}</div>
  </section>
);

export default function BukuSakuPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Buku Saku Admin"
        description="Panduan singkat penggunaan dasbor dan pemeliharaan website Kampung Adat Cireundeu."
        actions={
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Cetak Panduan
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
        <Card className="border-border shadow-card print:border-0 print:shadow-none">
          <CardContent className="space-y-10 p-6 sm:p-8">
            <Section id="pendahuluan" title="A. Pendahuluan">
              <p>
                Website Kampung Adat Cireundeu adalah media promosi digital yang menampilkan profil kampung,
                produk lokal (batik, kerajinan, kuliner), galeri kegiatan, artikel/berita, dan informasi kontak.
                Dasbor ini memungkinkan operator lokal mengelola seluruh isi website secara mandiri tanpa perlu
                menyentuh kode.
              </p>
            </Section>

            <Section id="domain" title="B. Karakteristik Domain">
              <p>Penjelasan singkat istilah teknis yang perlu dipahami:</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Istilah</TableHead>
                    <TableHead>Penjelasan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium">Domain</TableCell><TableCell>Alamat website yang diketik pengunjung di browser.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Hosting</TableCell><TableCell>Tempat menyimpan seluruh file website agar bisa diakses.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">SSL / HTTPS</TableCell><TableCell>Sistem keamanan agar data yang dikirim ke website terlindungi.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Admin</TableCell><TableCell>Pengelola yang memiliki akses untuk mengubah isi website.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Dashboard</TableCell><TableCell>Ruang kerja admin untuk mengelola konten.</TableCell></TableRow>
                </TableBody>
              </Table>
            </Section>

            <Section id="pemeliharaan" title="C. Pemeliharaan Website">
              <p>Checklist pemeliharaan rutin:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Cek website setiap minggu apakah masih dapat dibuka.</li>
                <li>Cek link WhatsApp dan Instagram masih aktif.</li>
                <li>Perbarui foto produk secara berkala.</li>
                <li>Perbarui artikel atau berita kegiatan.</li>
                <li>Hapus konten yang sudah tidak relevan.</li>
                <li>Cek masa aktif domain dan hosting menjelang habis.</li>
                <li>Simpan data login di tempat yang aman.</li>
                <li>Gunakan kata sandi yang kuat dan ganti secara berkala.</li>
              </ul>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Kegiatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium">Mingguan</TableCell><TableCell>Cek website, kontak, dan link sosial media.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Bulanan</TableCell><TableCell>Perbarui produk, galeri, dan artikel.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Tiga Bulanan</TableCell><TableCell>Periksa ulang data produk dan kontak.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Tahunan</TableCell><TableCell>Periksa masa aktif domain dan hosting.</TableCell></TableRow>
                </TableBody>
              </Table>
            </Section>

            <Section id="dashboard" title="D. Penggunaan Dashboard">
              <p>Langkah-langkah dasar:</p>
              <ol className="list-decimal space-y-1 pl-6">
                <li>Buka halaman <strong>/admin/login</strong>.</li>
                <li>Masukkan email/username dan kata sandi.</li>
                <li>Masuk ke halaman dashboard.</li>
                <li>Pilih menu yang ingin dikelola pada sidebar kiri.</li>
                <li>Tambah atau edit konten yang dibutuhkan.</li>
                <li>Klik <strong>Simpan</strong> untuk menyimpan perubahan.</li>
                <li>Cek hasilnya di halaman website utama.</li>
              </ol>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tombol</TableHead>
                    <TableHead>Fungsi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium">Tambah</TableCell><TableCell>Menambahkan data baru.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Edit</TableCell><TableCell>Mengubah data yang sudah ada.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Hapus</TableCell><TableCell>Menghapus data yang tidak dipakai.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Simpan</TableCell><TableCell>Menyimpan perubahan ke website.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Preview</TableCell><TableCell>Melihat hasil sebelum dipublikasikan.</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Keluar</TableCell><TableCell>Keluar dari dashboard saat selesai.</TableCell></TableRow>
                </TableBody>
              </Table>
            </Section>

            <Section id="konten" title="E. Manajemen Konten Dasar">
              <p>Tips membuat konten yang baik:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Gunakan judul yang jelas dan langsung ke inti.</li>
                <li>Gunakan foto yang terang, tajam, dan tidak blur.</li>
                <li>Tulis deskripsi singkat, padat, dan menarik.</li>
                <li>Tampilkan keunikan lokal Kampung Adat Cireundeu.</li>
                <li>Hindari kata-kata yang sulit dipahami pengunjung.</li>
                <li>Pastikan nomor kontak yang dicantumkan aktif.</li>
                <li>Periksa ulang sebelum konten dipublikasikan.</li>
              </ul>
              <div className="rounded-md border border-border bg-muted/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contoh Deskripsi Produk</p>
                <p className="mt-2 italic">
                  "Batik Motif Cireundeu merupakan produk kreatif lokal yang terinspirasi dari nilai budaya dan
                  kearifan lokal Kampung Adat Cireundeu. Motif ini menampilkan identitas lokal yang dapat
                  digunakan sebagai pakaian, cendera mata, maupun media promosi budaya."
                </p>
              </div>
            </Section>

            <Section id="keamanan" title="F. Keamanan Akun Admin">
              <ul className="list-disc space-y-1 pl-6">
                <li>Jangan membagikan kata sandi kepada orang yang tidak bertugas.</li>
                <li>Gunakan kata sandi minimal 8 karakter, kombinasi huruf dan angka.</li>
                <li>Hindari kata sandi sederhana seperti <code>admin123</code> atau <code>123456</code>.</li>
                <li>Ganti kata sandi jika operator berganti.</li>
                <li>Selalu <strong>Keluar</strong> setelah selesai menggunakan dashboard.</li>
              </ul>
            </Section>
          </CardContent>
        </Card>

        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-20 rounded-md border border-border bg-card p-4 shadow-card">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Daftar Isi</p>
            <nav className="space-y-1 text-sm">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded px-2 py-1 text-foreground hover:bg-muted hover:text-forest"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}

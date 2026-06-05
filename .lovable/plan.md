# Rencana: Konversi Website Cireundeu menjadi Dynamic CMS Penuh

Ruang lingkup pekerjaan sangat besar (8 menu admin baru, ~15 section publik, upload media, navigasi dinamis, WhatsApp manager, dll). Saya usulkan eksekusi bertahap dalam **3 fase**, masing-masing fase langsung bisa dipakai dan diuji sebelum lanjut. Ini menghindari satu commit raksasa yang rawan error & sulit di-debug.

---

## Asumsi Struktur Project (sudah diverifikasi)

- **Routing**: React Router (HashRouter) di `src/App.tsx`, BUKAN TanStack file routing untuk halaman admin/publik. Saya akan tetap pakai pola ini agar tidak merombak arsitektur.
- **Supabase**: sudah aktif. Tabel existing: `site_content` (jsonb key/value), `tour_packages`, `gallery_photos`, `articles`, `products`, `village_profile`, `site_contact`, `profiles`, `user_roles`, `registration_codes`. RLS sudah benar (`is_staff` untuk write, public read).
- **Storage**: bucket `admin-uploads` sudah ada (private, perlu kebijakan publik read untuk media frontend → akan diubah ke public atau tambah policy).
- **Auth**: sudah ada `useAdminAuth`, `ProtectedRoute`, login dgn kode pendaftaran.
- **Komponen publik** yang masih hardcoded: `Navbar.tsx` (WhatsApp, Instagram, partner logos, nav items), `Footer.tsx` (WA, IG, FB, address, nav), `Hero.tsx` (sebagian sudah dinamis), `ContactReservation.tsx`, `Cuisine.tsx`, `Activities.tsx`, `Features.tsx`, `Gallery.tsx`, `News.tsx`, `Timeline.tsx`, `AdatProfile.tsx`, `StatsBar.tsx`.

---

## Strategi Data: gunakan `site_content` (jsonb) + tabel khusus

Daripada bikin 9 tabel baru yang rumit, saya pakai pendekatan **hybrid**:

- **`site_content`** (sudah ada, jsonb per key) untuk: teks per section, settings global, WhatsApp, social links, navigation, footer. Setiap section = 1 key.
- **Tabel khusus** (sudah ada) untuk koleksi: `tour_packages`, `gallery_photos`, `articles`, `products`.
- **Tabel baru kecil**: `media_assets` (untuk logo/partner/icon klikable terstruktur), `action_links` (CTA terpusat opsional — atau cukup masuk site_content).

Pola ini lebih cepat, fleksibel, dan menghindari over-engineering 9 tabel.

### Keys `site_content` yang akan ditambah/dipakai:
- `global_settings` — nama site, meta title, meta desc, favicon, logo utama
- `whatsapp` — nomor utama, link, pesan default per konteks (hero, kontak, footer, reservasi)
- `social_links` — instagram, facebook, tiktok, youtube (url + aktif)
- `navigation` — array menu navbar (label, href/route, external, aktif, urutan)
- `footer` — tagline, alamat, jam, copyright, link tambahan
- `hero` (sudah ada) — headline, sub, image, CTA primary/secondary
- `about`, `adat_profile` (sudah ada) — teks tentang & profil adat
- `cuisine` — intro + list kuliner (atau pakai tabel products kategori 'kuliner')
- `activities` — list aktivitas wisata
- `timeline` — list jejak sejarah
- `features` — list keunggulan
- `stats` — list angka stat
- `contact` — alamat, telp, email, jam, maps url (atau pakai `site_contact`)
- `partners` — list logo partner (nama, image_url, link)

---

## Fase 1 — Fondasi & Komponen Inti (PRIORITAS UTAMA)

**Database:**
- Migration: seed semua key `site_content` di atas dengan nilai default = persis konten saat ini (zero perubahan visual).
- Buat bucket `admin-uploads` jadi **public read** + tambah policy untuk staff write.
- Tabel baru `media_assets` (id, slot, name, image_url, link_url, target, active, sort_order) untuk partner logos & icon klikable.

**Frontend (hook & util):**
- Perluas `useSiteContent` agar mendukung prefetch banyak key sekaligus + invalidation.
- Buat `useWhatsApp(context)` helper untuk generate link WA dari setting.
- Buat `<DynamicLink>` component (handle internal/external/whatsapp/disabled).

**Refactor komponen publik agar dinamis (tetap pertahankan desain):**
- `Navbar.tsx` → nav items, WA button, IG link, partner logos dari DB.
- `Footer.tsx` → semua link, social, alamat, copyright dari DB.
- `Hero.tsx` → CTA label & target ikut dinamis.
- `ContactReservation.tsx`, `Cuisine.tsx`, `Activities.tsx`, `Features.tsx`, `Timeline.tsx`, `StatsBar.tsx`, `Gallery.tsx` → tarik dari `site_content` / tabel.

**Admin (Fase 1):**
- `/admin/pengaturan` — global settings, meta, favicon, logo, social links.
- `/admin/whatsapp` — nomor, link, template pesan per konteks.
- `/admin/navigasi` — CRUD menu navbar + footer.

---

## Fase 2 — Editor Konten Lengkap

- `/admin/beranda` (sudah ada, diperkaya: hero CTA, stats, features, partners).
- `/admin/konten` — editor per-section terpusat (about, adat, timeline, cuisine intro, activities intro).
- `/admin/tombol-link` — kelola action_links/CTA global.
- `/admin/logo-media` — upload & atur partner logos / icon klikable / media slot via `media_assets` + Storage.

---

## Fase 3 — Polish & Stabilitas

- Loading skeleton, empty state, error state di semua section publik.
- Validasi form admin (zod) + toast feedback konsisten.
- `/admin/pengguna` diperbaiki: tampil dgn role + pencabutan akses (admin only).
- Audit final: scan semua `href="https://wa.me/..."`, `instagram.com/...`, dan string hardcoded → ganti dengan data dinamis. Disabled state untuk link kosong.
- Test E2E manual: ubah di admin → reload publik → konten berubah.

---

## File yang akan dibuat/diubah (estimasi)

**Baru:**
- `supabase/migrations/<new>.sql` (seed site_content + media_assets + bucket public)
- `src/hooks/useWhatsApp.ts`, `src/hooks/useSiteSettings.ts`
- `src/components/DynamicLink.tsx`
- `src/pages/admin/Pengaturan.tsx` (rewrite), `Whatsapp.tsx`, `Navigasi.tsx`, `Konten.tsx`, `TombolLink.tsx`, `LogoMedia.tsx`

**Diubah:**
- `src/App.tsx` (route admin baru)
- `src/components/admin/AdminSidebar.tsx` (menu baru sesuai spek)
- Hampir semua `src/components/cireundeu/*.tsx` (refactor ke dinamis)
- `src/hooks/useSiteContent.ts` (perluas)

---

## Pertanyaan / Konfirmasi sebelum mulai

1. **Ukuran eksekusi**: Setujui pendekatan 3 fase ini? Saya **sangat menyarankan** mulai dari **Fase 1 dulu** dalam satu putaran (ini saja sudah ±15-20 file). Fase 2 & 3 di pesan berikutnya. Kalau dipaksa sekaligus akan rawan error & sulit di-review.
2. **Bucket storage**: OK kalau saya ubah `admin-uploads` menjadi **public read** (perlu untuk menampilkan gambar di website publik tanpa signed URL)? Write tetap dibatasi staff.
3. **Pendekatan data**: Setuju pakai `site_content` jsonb + tabel khusus existing (tidak bikin 9 tabel baru)? Ini jauh lebih cepat & cukup untuk skala kampung.

Jika semua OK, saya mulai dari Fase 1.

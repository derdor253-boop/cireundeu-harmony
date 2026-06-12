-- Clean baseline migration for Cireundeu Harmony
-- Copy seluruh isi file ini ke file migration baru: supabase/migrations/<timestamp>_init_schema.sql

-- ============ ROLES & PROFILES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'operator');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile read"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "own profile write"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "own profile insert"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "see own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'operator')
  )
$$;

CREATE POLICY "staff read profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "admins manage user_roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END
$$;

CREATE TRIGGER trg_profiles_touch
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ============ NEW USER TRIGGER ============
-- User pertama otomatis jadi admin. User berikutnya otomatis jadi operator.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );

  IF NOT EXISTS (SELECT 1 FROM public.user_roles) THEN
    v_role := 'admin';
  ELSE
    v_role := 'operator';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role);

  RETURN NEW;
END
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============ REGISTRATION CODES ============
CREATE TABLE public.registration_codes (
  code TEXT PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.registration_codes TO authenticated;
GRANT ALL ON public.registration_codes TO service_role;

ALTER TABLE public.registration_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin manage codes"
  ON public.registration_codes
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.registration_codes (code, active, note)
VALUES
  ('TELKOMCIREUNDEU', true, 'Kode default Kampung Adat Cireundeu'),
  ('CIREUNDEU2026', true, 'Kode pendaftaran umum 2026')
ON CONFLICT (code) DO UPDATE
SET active = EXCLUDED.active,
    note = EXCLUDED.note;

CREATE OR REPLACE FUNCTION public.validate_registration_code(_code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.registration_codes
    WHERE code = _code
      AND active = true
  )
$$;

-- ============ SITE CONTENT ============
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read site_content"
  ON public.site_content
  FOR SELECT
  USING (true);

CREATE POLICY "staff write site_content"
  ON public.site_content
  FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_site_content_touch
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ============ TOUR PACKAGES ============
CREATE TABLE public.tour_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration TEXT,
  price TEXT,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tour_packages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tour_packages TO authenticated;
GRANT ALL ON public.tour_packages TO service_role;

ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read packages"
  ON public.tour_packages
  FOR SELECT
  USING (true);

CREATE POLICY "staff write packages"
  ON public.tour_packages
  FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_packages_touch
  BEFORE UPDATE ON public.tour_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.tour_packages (name, duration, price, description, features, sort_order, active) VALUES
  ('Paket Setengah Hari', '3-4 jam', 'Rp 75.000 / orang', 'Pengenalan budaya & kuliner rasi.', '["Welcome drink", "Tur kampung", "Cicip rasi", "Pemandu lokal"]'::jsonb, 1, true),
  ('Paket Satu Hari', '8 jam', 'Rp 150.000 / orang', 'Wisata edukasi lengkap dengan makan siang.', '["Welcome drink", "Tur kampung", "Makan siang rasi", "Workshop pengolahan singkong", "Pemandu lokal"]'::jsonb, 2, true),
  ('Paket Menginap', '1 malam', 'Rp 350.000 / orang', 'Homestay & ritual pagi bersama warga.', '["Homestay", "3x makan", "Upacara adat pagi", "Hiking", "Pemandu lokal"]'::jsonb, 3, true);

-- ============ GALLERY PHOTOS ============
CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  caption TEXT,
  category TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gallery_photos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read gallery"
  ON public.gallery_photos
  FOR SELECT
  USING (true);

CREATE POLICY "staff write gallery"
  ON public.gallery_photos
  FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_gallery_touch
  BEFORE UPDATE ON public.gallery_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  price TEXT,
  maker TEXT,
  image_url TEXT,
  whatsapp TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'available', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read products"
  ON public.products
  FOR SELECT
  USING (true);

CREATE POLICY "staff write products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_products_touch
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ============ ARTICLES ============
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published articles"
  ON public.articles
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "staff manage articles"
  ON public.articles
  FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_articles_touch
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ============ VILLAGE PROFILE ============
CREATE TABLE public.village_profile (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT,
  short_description TEXT,
  history TEXT,
  cultural_values TEXT,
  local_uniqueness TEXT,
  hero_image_url TEXT,
  address TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.village_profile TO anon, authenticated;
GRANT INSERT, UPDATE ON public.village_profile TO authenticated;
GRANT ALL ON public.village_profile TO service_role;

ALTER TABLE public.village_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read village"
  ON public.village_profile
  FOR SELECT
  USING (true);

CREATE POLICY "staff write village"
  ON public.village_profile
  FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_village_profile_touch
  BEFORE UPDATE ON public.village_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.village_profile (
  id,
  name,
  short_description,
  history,
  cultural_values,
  local_uniqueness,
  address
) VALUES (
  1,
  'Kampung Adat Cireundeu',
  'Kampung adat penghasil rasi di Cimahi Selatan',
  'Tradisi mengonsumsi rasi dimulai sejak masa Mama Ali, sebagai bentuk perlawanan terhadap monopoli beras dan komitmen terhadap kemandirian pangan.',
  'Ngindung Ka Waktu, Mibapa Ka Jaman.',
  'Kearifan pangan lokal berbasis singkong, tata kelola hutan adat, dan tradisi Sunda Wiwitan.',
  'Kp. Cireundeu, Leuwigajah, Kec. Cimahi Selatan, Kota Cimahi, Jawa Barat 40532'
);

-- ============ SITE CONTACT ============
CREATE TABLE public.site_contact (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp TEXT,
  instagram TEXT,
  email TEXT,
  address TEXT,
  maps_url TEXT,
  hours TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_contact TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_contact TO authenticated;
GRANT ALL ON public.site_contact TO service_role;

ALTER TABLE public.site_contact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read contact"
  ON public.site_contact
  FOR SELECT
  USING (true);

CREATE POLICY "staff write contact"
  ON public.site_contact
  FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_site_contact_touch
  BEFORE UPDATE ON public.site_contact
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_contact (
  id,
  whatsapp,
  instagram,
  email,
  address,
  maps_url,
  hours
) VALUES (
  1,
  '6281200000000',
  'https://instagram.com/kampungadatcireundeu',
  '',
  'Kp. Cireundeu, Leuwigajah, Kec. Cimahi Selatan, Kota Cimahi, Jawa Barat 40532',
  'https://www.google.com/maps?q=Kampung+Adat+Cireundeu,+Leuwigajah,+Cimahi+Selatan',
  'Setiap hari, 24 jam (reservasi paket: pagi hari direkomendasikan)'
);

-- ============ MEDIA ASSETS ============
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot TEXT NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  target TEXT NOT NULL DEFAULT '_self',
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.media_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read media"
  ON public.media_assets
  FOR SELECT
  USING (true);

CREATE POLICY "staff write media"
  ON public.media_assets
  FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_media_assets_touch
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX media_assets_slot_idx ON public.media_assets (slot, sort_order);

INSERT INTO public.media_assets (slot, name, image_url, link_url, target, sort_order) VALUES
  ('partners', 'Diktisaintek Berdampak', '', '', '_blank', 1),
  ('partners', 'Telkom University', '', 'https://telkomuniversity.ac.id', '_blank', 2),
  ('partners', 'Direktorat Akademik', '', '', '_blank', 3),
  ('partners', 'BPA', '', '', '_blank', 4),
  ('partners', 'Julang Ngapak', '', '', '_blank', 5),
  ('partners', 'KKN Cireundeu', '', '', '_blank', 6);

-- ============ SITE CONTENT SEEDS ============
INSERT INTO public.site_content (key, data) VALUES
('global_settings', jsonb_build_object(
  'site_name', 'Kampung Adat Cireundeu',
  'tagline', 'Ngindung Ka Waktu, Mibapa Ka Jaman',
  'meta_title', 'Kampung Adat Cireundeu — Wisata Budaya Sunda di Cimahi',
  'meta_description', 'Kampung adat yang menjaga tradisi leluhur di tengah modernitas, terletak di lembah hijau Cimahi Selatan, Jawa Barat.',
  'favicon_url', '',
  'logo_url', ''
)),
('whatsapp', jsonb_build_object(
  'number', '6281200000000',
  'display', '+62 812-0000-0000',
  'default_message', 'Halo, saya ingin bertanya tentang Kampung Adat Cireundeu.',
  'hero_message', 'Halo, saya tertarik berkunjung ke Kampung Adat Cireundeu.',
  'reservation_message', 'Halo, saya ingin reservasi kunjungan ke Kampung Adat Cireundeu.',
  'footer_message', 'Halo Sekretariat Cireundeu, saya ingin bertanya.'
)),
('social_links', jsonb_build_object(
  'instagram', jsonb_build_object('url', 'https://instagram.com/kampungadatcireundeu', 'active', true),
  'facebook', jsonb_build_object('url', 'https://facebook.com/kampungadatcireundeu', 'active', true),
  'tiktok', jsonb_build_object('url', '', 'active', false),
  'youtube', jsonb_build_object('url', '', 'active', false)
)),
('navigation', jsonb_build_object('items', jsonb_build_array(
  jsonb_build_object('label', 'Beranda', 'href', '#beranda', 'active', true, 'external', false),
  jsonb_build_object('label', 'Tentang Kami', 'href', '#tentang', 'active', true, 'external', false),
  jsonb_build_object('label', 'Jejak Waktu', 'href', '#sejarah', 'active', true, 'external', false),
  jsonb_build_object('label', 'Kepercayaan & Tata Kelola', 'href', '#profil-adat', 'active', true, 'external', false),
  jsonb_build_object('label', 'Kuliner Khas', 'href', '#kuliner', 'active', true, 'external', false),
  jsonb_build_object('label', 'Wisata & Aktivitas', 'href', '#wisata', 'active', true, 'external', false),
  jsonb_build_object('label', 'Reservasi & Kontak', 'href', '#kontak', 'active', true, 'external', false)
))),
('footer', jsonb_build_object(
  'tagline', 'Kampung adat yang menjaga tradisi leluhur di tengah modernitas — terbuka menerima tamu yang datang dengan hormat dan rasa ingin belajar.',
  'copyright', '© 2025 Kampung Adat Cireundeu — Leuwigajah, Cimahi Selatan',
  'footnote', 'Dibangun dengan hormat kepada karuhun & alam.'
)),
('contact_info', jsonb_build_object(
  'address', 'Kp. Cireundeu, Leuwigajah, Kec. Cimahi Selatan, Kota Cimahi, Jawa Barat 40532',
  'access', '7,2 km dari Alun-alun Cimahi · 18 km (~45 menit) dari Terminal Leuwipanjang',
  'hours', 'Setiap hari, 24 jam (reservasi paket: pagi hari direkomendasikan)',
  'phone_display', '+62 812-0000-0000 (Sekretariat Adat)',
  'email', '',
  'maps_embed_url', 'https://www.google.com/maps?q=Kampung+Adat+Cireundeu,+Leuwigajah,+Cimahi+Selatan&output=embed'
)),
('hero', jsonb_build_object(
  'headline', 'Wilujeng Sumping di Kampung Adat Cireundeu',
  'subheadline', 'Kampung adat yang menjaga tradisi leluhur di tengah modernitas, terletak di lembah hijau Cimahi Selatan, Jawa Barat.',
  'badge_text', 'Leuwigajah • Cimahi Selatan • Jawa Barat',
  'cta_primary_label', 'Jelajahi Kampung',
  'cta_primary_href', '#wisata',
  'cta_secondary_label', 'Reservasi Kunjungan',
  'cta_secondary_href', '#kontak',
  'hero_image_url', ''
)),
('about', jsonb_build_object(
  'title', 'Mengenal Kampung Adat Cireundeu',
  'body', 'Nama Cireundeu berasal dari pohon reundeu, tanaman herbal yang dahulu banyak tumbuh di lembah ini dan dipakai sebagai obat tradisional. Masyarakat memegang teguh ajaran leluhur yang menekankan keselarasan hidup dengan alam.'
)),
('history', jsonb_build_object(
  'title', 'Sejarah & Profil Adat Cireundeu',
  'body', 'Tradisi mengonsumsi rasi dimulai sejak masa Mama Ali, sebagai bentuk perlawanan terhadap monopoli beras dan komitmen terhadap kemandirian pangan. Hingga kini nilai-nilai itu terus dijaga.'
)),
('features', jsonb_build_object(
  'eyebrow', 'Keunikan Utama',
  'title', 'Tiga Pilar Kehidupan Cireundeu',
  'items', jsonb_build_array(
    jsonb_build_object('icon', 'Wheat', 'eyebrow', 'Rasi Singkong', 'title', 'Makanan Pokok Tanpa Beras', 'body', 'Sejak 1918, masyarakat Cireundeu mengonsumsi rasi (beras singkong) sebagai pengganti nasi. Tradisi ini dipelopori oleh Ibu Omah Asnamah, yang dianugerahi gelar Pahlawan Pangan pada tahun 1964.'),
    jsonb_build_object('icon', 'Sprout', 'eyebrow', 'Sunda Wiwitan', 'title', 'Kepercayaan & Kearifan Lokal', 'body', 'Ajaran leluhur yang mengajarkan hidup selaras dengan alam. Empat warna dasar — merah, kuning, hitam, dan putih — melambangkan keseimbangan unsur kehidupan manusia dan semesta.'),
    jsonb_build_object('icon', 'Trees', 'eyebrow', 'Leuweung Tilu', 'title', 'Tiga Kawasan Hutan Adat', 'body', 'Wilayah hutan dibagi tiga: Leuweung Larangan (terlarang dijamah), Leuweung Tutupan (cadangan air & flora), dan Leuweung Baladahan (hutan produksi untuk kehidupan warga).')
  )
)),
('stats', jsonb_build_object('items', jsonb_build_array(
  jsonb_build_object('icon', 'Users', 'value', '±800 Jiwa', 'label', 'Penduduk Adat'),
  jsonb_build_object('icon', 'Map', 'value', '64 Hektar', 'label', 'Luas Wilayah'),
  jsonb_build_object('icon', 'Wheat', 'value', '~85 Tahun', 'label', 'Tradisi Rasi Singkong'),
  jsonb_build_object('icon', 'Landmark', 'value', 'Abad ke-16', 'label', 'Berdiri Sejak')
))),
('timeline', jsonb_build_object(
  'eyebrow', 'Sejarah & Tradisi',
  'title', 'Jejak Waktu Kampung Cireundeu',
  'highlight_title', 'Tradisi 1 Suro',
  'highlight_body', 'Upacara adat tahunan terbesar masyarakat Cireundeu, ditandai dengan pagelaran Angklung Buncis, doa bersama, dan ritual syukur atas hasil bumi.',
  'items', jsonb_build_array(
    jsonb_build_object('year', 'Abad 16', 'title', 'Berdirinya Kampung Cireundeu', 'desc', 'Dibuktikan oleh keberadaan rumah panggung berbatu tatapakan yang masih lestari hingga kini.'),
    jsonb_build_object('year', '1918', 'title', 'Peralihan ke Rasi Singkong', 'desc', 'Ibu Omah Asnamah memimpin peralihan makanan pokok dari beras ke singkong sebagai bentuk kemandirian pangan.'),
    jsonb_build_object('year', '1964', 'title', 'Penghargaan Pahlawan Pangan', 'desc', 'Ibu Omah Asnamah dianugerahi gelar Pahlawan Pangan oleh negara atas kontribusinya pada ketahanan pangan lokal.'),
    jsonb_build_object('year', 'Kini', 'title', 'Destinasi Wisata Budaya Aktif', 'desc', '±2.000 pengunjung per bulan datang menyaksikan dan belajar dari kehidupan adat yang lestari.')
  )
)),
('cuisine', jsonb_build_object(
  'eyebrow', 'Kuliner Khas',
  'title', 'Cita Rasa Adat dari Tanah Cireundeu',
  'intro', 'Olahan singkong yang menjadi nadi dapur masyarakat — sederhana, bergizi, dan penuh warisan.',
  'items', jsonb_build_array(
    jsonb_build_object('name', 'Rasi (Beras Singkong)', 'desc', 'Makanan pokok pengganti nasi. Diolah dari singkong fermentasi, tekstur pulen, kaya serat.', 'image_url', ''),
    jsonb_build_object('name', 'Dendeng Kulit Singkong', 'desc', 'Camilan khas yang renyah dan gurih, terbuat dari kulit singkong pilihan.', 'image_url', ''),
    jsonb_build_object('name', 'Kripik Kaca (Kripca)', 'desc', 'Keripik tipis bening khas Cireundeu — renyah, gurih, dan kini jadi oleh-oleh favorit.', 'image_url', ''),
    jsonb_build_object('name', 'Egg Roll Singkong', 'desc', 'Jajanan manis tradisional bertekstur ringan, cocok untuk teman teh sore.', 'image_url', ''),
    jsonb_build_object('name', 'Cireng', 'desc', 'Adonan singkong goreng yang gurih di luar, kenyal di dalam, ikon jajanan Sunda.', 'image_url', ''),
    jsonb_build_object('name', 'Saroja', 'desc', 'Kue kembang goreng berbahan dasar singkong — renyah, manis legit, dan klasik.', 'image_url', '')
  )
)),
('activities', jsonb_build_object(
  'eyebrow', 'Wisata & Aktivitas',
  'title', 'Pengalaman Otentik di Tanah Adat',
  'intro', 'Beragam aktivitas budaya, kuliner, dan spiritual yang dapat Anda ikuti bersama warga.',
  'items', jsonb_build_array(
    jsonb_build_object('icon', 'Drum', 'title', 'Angklung Buncis & Gondang', 'desc', 'Pertunjukan seni musik tradisional Sunda khas Cireundeu.', 'image_url', ''),
    jsonb_build_object('icon', 'Mountain', 'title', 'Hiking ke Puncak Salam', 'desc', 'Perjalanan sakral menuju puncak — wajib tanpa alas kaki.', 'image_url', ''),
    jsonb_build_object('icon', 'ChefHat', 'title', 'Workshop Kuliner Singkong', 'desc', 'Belajar membuat rasi, cireng, kripca, hingga dendeng langsung dari ibu-ibu warga.', 'image_url', ''),
    jsonb_build_object('icon', 'Leaf', 'title', 'Kerajinan Janur & Wayang', 'desc', 'Workshop kerajinan dari daun kelapa dan wayang dari daun singkong.', 'image_url', ''),
    jsonb_build_object('icon', 'Home', 'title', 'Homestay Rumah Adat', 'desc', 'Menginap di rumah warga dan merasakan langsung kehidupan adat.', 'image_url', ''),
    jsonb_build_object('icon', 'Camera', 'title', 'Situs Meriam Sapu Jagat', 'desc', 'Landmark bersejarah di gerbang masuk, saksi bisu perjalanan kampung adat.', 'image_url', ''),
    jsonb_build_object('icon', 'GraduationCap', 'title', 'Edukasi Budaya', 'desc', 'Program belajar bersama sesepuh adat untuk pelajar dan komunitas.', 'image_url', ''),
    jsonb_build_object('icon', 'Sparkles', 'title', 'Upacara Adat', 'desc', 'Menyaksikan upacara adat seperti Tutup Taun, Ngemban Taun, dan ritual syukuran.', 'image_url', ''),
    jsonb_build_object('icon', 'Wheat', 'title', 'Hamparan Singkong & Pangan Lokal', 'desc', 'Menyusuri ladang singkong dan mencicipi pangan lokal dari dapur tradisional.', 'image_url', '')
  )
)),
('reservation_form', jsonb_build_object(
  'title', 'Reservasi & Hubungi Kami',
  'eyebrow', 'Lokasi & Kontak',
  'form_title', 'Formulir Reservasi',
  'form_subtitle', 'Isi data berikut, tim kami akan menghubungi Anda untuk konfirmasi.',
  'packages', jsonb_build_array(
    jsonb_build_object('value', 'setengah-hari', 'label', 'Paket Setengah Hari (2 aktivitas)'),
    jsonb_build_object('value', 'satu-hari', 'label', 'Paket Satu Hari (3 aktivitas)'),
    jsonb_build_object('value', 'menginap', 'label', 'Paket Menginap (Homestay)'),
    jsonb_build_object('value', 'konsultasi', 'label', 'Konsultasi dulu')
  )
))
ON CONFLICT (key) DO UPDATE
SET data = EXCLUDED.data,
    updated_at = now();

-- ============ STORAGE BUCKET & POLICIES ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-uploads', 'admin-uploads', false)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

CREATE POLICY "public read admin-uploads"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'admin-uploads');

CREATE POLICY "staff upload admin-uploads"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'admin-uploads' AND public.is_staff(auth.uid()));

CREATE POLICY "staff update admin-uploads"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'admin-uploads' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'admin-uploads' AND public.is_staff(auth.uid()));

CREATE POLICY "staff delete admin-uploads"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'admin-uploads' AND public.is_staff(auth.uid()));

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.media_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tour_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_photos;

ALTER TABLE public.site_content REPLICA IDENTITY FULL;
ALTER TABLE public.media_assets REPLICA IDENTITY FULL;
ALTER TABLE public.tour_packages REPLICA IDENTITY FULL;
ALTER TABLE public.gallery_photos REPLICA IDENTITY FULL;

-- ============ FUNCTION EXECUTE PERMISSIONS ============
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.validate_registration_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_registration_code(text) TO anon, authenticated, service_role;

-- ============ INDEXES ============
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_tour_packages_active_sort ON public.tour_packages(active, sort_order);
CREATE INDEX idx_gallery_photos_created_at ON public.gallery_photos(created_at DESC);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX idx_articles_published_created_at ON public.articles(published, created_at DESC);

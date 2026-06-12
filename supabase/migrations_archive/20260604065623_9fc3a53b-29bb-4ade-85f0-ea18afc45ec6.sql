
-- ============ ROLES & PROFILES ============
CREATE TYPE public.app_role AS ENUM ('admin','operator');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read"  ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','operator'))
$$;

-- New user trigger: create profile + assign role (first ever = admin, others = operator)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));

  IF NOT EXISTS (SELECT 1 FROM public.user_roles) THEN
    v_role := 'admin';
  ELSE
    v_role := 'operator';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role);
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
CREATE POLICY "admin manage codes" ON public.registration_codes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.registration_codes (code, note) VALUES ('TELKOMCIREUNDEU','Kode default Kampung Adat Cireundeu');

CREATE OR REPLACE FUNCTION public.validate_registration_code(_code text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.registration_codes WHERE code = _code AND active = true)
$$;
GRANT EXECUTE ON FUNCTION public.validate_registration_code(text) TO anon, authenticated;

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ============ SITE CONTENT (key/value JSON) ============
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "staff write site_content" ON public.site_content FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_site_content_touch BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_content (key, data) VALUES
('hero', '{"headline":"Wilujeng Sumping di Kampung Adat Cireundeu","subheadline":"Kampung adat penghasil rasi (beras singkong) di Cimahi Selatan — jaga budaya, jaga alam, jaga pangan.","hero_image_url":""}'::jsonb),
('about', '{"title":"Tentang Kampung Adat Cireundeu","body":"Kampung Adat Cireundeu adalah masyarakat adat Sunda yang sejak 1924 menjadikan singkong sebagai makanan pokok, sebagai wujud kedaulatan pangan dan kearifan lokal."}'::jsonb),
('history', '{"title":"Sejarah & Profil Adat Cireundeu","body":"Tradisi mengonsumsi rasi dimulai sejak masa Mama Ali, sebagai bentuk perlawanan terhadap monopoli beras dan komitmen terhadap kemandirian pangan. Hingga kini nilai-nilai itu terus dijaga."}'::jsonb);

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tour_packages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tour_packages TO authenticated;
GRANT ALL ON public.tour_packages TO service_role;
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read packages" ON public.tour_packages FOR SELECT USING (true);
CREATE POLICY "staff write packages" ON public.tour_packages FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_packages_touch BEFORE UPDATE ON public.tour_packages
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.tour_packages (name, duration, price, description, features, sort_order) VALUES
('Paket Setengah Hari','3-4 jam','Rp 75.000 / orang','Pengenalan budaya & kuliner rasi.','["Welcome drink","Tur kampung","Cicip rasi","Pemandu lokal"]'::jsonb,1),
('Paket Satu Hari','8 jam','Rp 150.000 / orang','Wisata edukasi lengkap dengan makan siang.','["Welcome drink","Tur kampung","Makan siang rasi","Workshop pengolahan singkong","Pemandu lokal"]'::jsonb,2),
('Paket Menginap','1 malam','Rp 350.000 / orang','Homestay & ritual pagi bersama warga.','["Homestay","3x makan","Upacara adat pagi","Hiking","Pemandu lokal"]'::jsonb,3);

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
CREATE POLICY "public read gallery" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "staff write gallery" ON public.gallery_photos FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_gallery_touch BEFORE UPDATE ON public.gallery_photos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

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
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "staff write products" ON public.products FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_products_touch BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

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
CREATE POLICY "public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "staff write articles" ON public.articles FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_articles_touch BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ VILLAGE PROFILE & CONTACT (singletons) ============
CREATE TABLE public.village_profile (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT,
  short_description TEXT,
  history TEXT,
  cultural_values TEXT,
  local_uniqueness TEXT,
  hero_image_url TEXT,
  address TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (id = 1)
);
GRANT SELECT ON public.village_profile TO anon, authenticated;
GRANT INSERT, UPDATE ON public.village_profile TO authenticated;
GRANT ALL ON public.village_profile TO service_role;
ALTER TABLE public.village_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read village" ON public.village_profile FOR SELECT USING (true);
CREATE POLICY "staff write village" ON public.village_profile FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
INSERT INTO public.village_profile (id, name, short_description) VALUES (1,'Kampung Adat Cireundeu','Kampung adat penghasil rasi di Cimahi Selatan');

CREATE TABLE public.site_contact (
  id INT PRIMARY KEY DEFAULT 1,
  whatsapp TEXT, instagram TEXT, email TEXT, address TEXT, maps_url TEXT, hours TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (id = 1)
);
GRANT SELECT ON public.site_contact TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_contact TO authenticated;
GRANT ALL ON public.site_contact TO service_role;
ALTER TABLE public.site_contact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read contact" ON public.site_contact FOR SELECT USING (true);
CREATE POLICY "staff write contact" ON public.site_contact FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
INSERT INTO public.site_contact (id) VALUES (1);

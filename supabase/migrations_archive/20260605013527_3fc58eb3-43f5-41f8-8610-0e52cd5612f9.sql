
-- ============ media_assets ============
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot text NOT NULL,
  name text NOT NULL,
  image_url text,
  link_url text,
  target text NOT NULL DEFAULT '_self',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read media" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "staff write media" ON public.media_assets FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER media_assets_touch BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX media_assets_slot_idx ON public.media_assets(slot, sort_order);

-- Seed partner logos (slot=partners)
INSERT INTO public.media_assets (slot, name, image_url, link_url, target, sort_order) VALUES
  ('partners', 'Diktisaintek Berdampak', '', '', '_blank', 1),
  ('partners', 'Telkom University', '', 'https://telkomuniversity.ac.id', '_blank', 2),
  ('partners', 'Direktorat Akademik', '', '', '_blank', 3),
  ('partners', 'BPA', '', '', '_blank', 4),
  ('partners', 'Julang Ngapak', '', '', '_blank', 5),
  ('partners', 'KKN Cireundeu', '', '', '_blank', 6);

-- ============ site_content seeds ============
-- helper: upsert
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
  'instagram', jsonb_build_object('url','https://instagram.com/kampungadatcireundeu','active',true),
  'facebook',  jsonb_build_object('url','https://facebook.com/kampungadatcireundeu','active',true),
  'tiktok',    jsonb_build_object('url','','active',false),
  'youtube',   jsonb_build_object('url','','active',false)
)),
('navigation', jsonb_build_object('items', jsonb_build_array(
  jsonb_build_object('label','Beranda','href','#beranda','active',true,'external',false),
  jsonb_build_object('label','Tentang Kami','href','#tentang','active',true,'external',false),
  jsonb_build_object('label','Jejak Waktu','href','#sejarah','active',true,'external',false),
  jsonb_build_object('label','Kepercayaan & Tata Kelola','href','#profil-adat','active',true,'external',false),
  jsonb_build_object('label','Kuliner Khas','href','#kuliner','active',true,'external',false),
  jsonb_build_object('label','Wisata & Aktivitas','href','#wisata','active',true,'external',false),
  jsonb_build_object('label','Reservasi & Kontak','href','#kontak','active',true,'external',false)
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
  'headline','Wilujeng Sumping di Kampung Adat Cireundeu',
  'subheadline','Kampung adat yang menjaga tradisi leluhur di tengah modernitas, terletak di lembah hijau Cimahi Selatan, Jawa Barat.',
  'badge_text','Leuwigajah • Cimahi Selatan • Jawa Barat',
  'cta_primary_label','Jelajahi Kampung',
  'cta_primary_href','#wisata',
  'cta_secondary_label','Reservasi Kunjungan',
  'cta_secondary_href','#kontak',
  'hero_image_url',''
)),
('about', jsonb_build_object(
  'title','Mengenal Kampung Adat Cireundeu',
  'body','Nama Cireundeu berasal dari pohon reundeu, tanaman herbal yang dahulu banyak tumbuh di lembah ini dan dipakai sebagai obat tradisional. Masyarakat memegang teguh ajaran leluhur yang menekankan keselarasan hidup dengan alam.'
)),
('history', jsonb_build_object(
  'title','Sejarah & Profil Adat Cireundeu',
  'body','Tradisi mengonsumsi rasi dimulai sejak masa Mama Ali, sebagai bentuk perlawanan terhadap monopoli beras dan komitmen terhadap kemandirian pangan. Hingga kini nilai-nilai itu terus dijaga.'
)),
('features', jsonb_build_object(
  'eyebrow','Keunikan Utama',
  'title','Tiga Pilar Kehidupan Cireundeu',
  'items', jsonb_build_array(
    jsonb_build_object('icon','Wheat','eyebrow','Rasi Singkong','title','Makanan Pokok Tanpa Beras','body','Sejak 1918, masyarakat Cireundeu mengonsumsi rasi (beras singkong) sebagai pengganti nasi. Tradisi ini dipelopori oleh Ibu Omah Asnamah, yang dianugerahi gelar Pahlawan Pangan pada tahun 1964.'),
    jsonb_build_object('icon','Sprout','eyebrow','Sunda Wiwitan','title','Kepercayaan & Kearifan Lokal','body','Ajaran leluhur yang mengajarkan hidup selaras dengan alam. Empat warna dasar — merah, kuning, hitam, dan putih — melambangkan keseimbangan unsur kehidupan manusia dan semesta.'),
    jsonb_build_object('icon','Trees','eyebrow','Leuweung Tilu','title','Tiga Kawasan Hutan Adat','body','Wilayah hutan dibagi tiga: Leuweung Larangan (terlarang dijamah), Leuweung Tutupan (cadangan air & flora), dan Leuweung Baladahan (hutan produksi untuk kehidupan warga).')
  )
)),
('stats', jsonb_build_object('items', jsonb_build_array(
  jsonb_build_object('icon','Users','value','±800 Jiwa','label','Penduduk Adat'),
  jsonb_build_object('icon','Map','value','64 Hektar','label','Luas Wilayah'),
  jsonb_build_object('icon','Wheat','value','~85 Tahun','label','Tradisi Rasi Singkong'),
  jsonb_build_object('icon','Landmark','value','Abad ke-16','label','Berdiri Sejak')
))),
('timeline', jsonb_build_object(
  'eyebrow','Sejarah & Tradisi',
  'title','Jejak Waktu Kampung Cireundeu',
  'highlight_title','Tradisi 1 Suro',
  'highlight_body','Upacara adat tahunan terbesar masyarakat Cireundeu, ditandai dengan pagelaran Angklung Buncis, doa bersama, dan ritual syukur atas hasil bumi.',
  'items', jsonb_build_array(
    jsonb_build_object('year','Abad 16','title','Berdirinya Kampung Cireundeu','desc','Dibuktikan oleh keberadaan rumah panggung berbatu tatapakan yang masih lestari hingga kini.'),
    jsonb_build_object('year','1918','title','Peralihan ke Rasi Singkong','desc','Ibu Omah Asnamah memimpin peralihan makanan pokok dari beras ke singkong sebagai bentuk kemandirian pangan.'),
    jsonb_build_object('year','1964','title','Penghargaan Pahlawan Pangan','desc','Ibu Omah Asnamah dianugerahi gelar Pahlawan Pangan oleh negara atas kontribusinya pada ketahanan pangan lokal.'),
    jsonb_build_object('year','Kini','title','Destinasi Wisata Budaya Aktif','desc','±2.000 pengunjung per bulan datang menyaksikan dan belajar dari kehidupan adat yang lestari.')
  )
)),
('cuisine', jsonb_build_object(
  'eyebrow','Kuliner Khas',
  'title','Cita Rasa Adat dari Tanah Cireundeu',
  'intro','Olahan singkong yang menjadi nadi dapur masyarakat — sederhana, bergizi, dan penuh warisan.',
  'items', jsonb_build_array(
    jsonb_build_object('name','Rasi (Beras Singkong)','desc','Makanan pokok pengganti nasi. Diolah dari singkong fermentasi, tekstur pulen, kaya serat.','image_url',''),
    jsonb_build_object('name','Dendeng Kulit Singkong','desc','Camilan khas yang renyah dan gurih, terbuat dari kulit singkong pilihan.','image_url',''),
    jsonb_build_object('name','Kripik Kaca (Kripca)','desc','Keripik tipis bening khas Cireundeu — renyah, gurih, dan kini jadi oleh-oleh favorit.','image_url',''),
    jsonb_build_object('name','Egg Roll Singkong','desc','Jajanan manis tradisional bertekstur ringan, cocok untuk teman teh sore.','image_url',''),
    jsonb_build_object('name','Cireng','desc','Adonan singkong goreng yang gurih di luar, kenyal di dalam, ikon jajanan Sunda.','image_url',''),
    jsonb_build_object('name','Saroja','desc','Kue kembang goreng berbahan dasar singkong — renyah, manis legit, dan klasik.','image_url','')
  )
)),
('activities', jsonb_build_object(
  'eyebrow','Wisata & Aktivitas',
  'title','Pengalaman Otentik di Tanah Adat',
  'intro','Beragam aktivitas budaya, kuliner, dan spiritual yang dapat Anda ikuti bersama warga.',
  'items', jsonb_build_array(
    jsonb_build_object('icon','Drum','title','Angklung Buncis & Gondang','desc','Pertunjukan seni musik tradisional Sunda khas Cireundeu.','image_url',''),
    jsonb_build_object('icon','Mountain','title','Hiking ke Puncak Salam','desc','Perjalanan sakral menuju puncak — wajib tanpa alas kaki.','image_url',''),
    jsonb_build_object('icon','ChefHat','title','Workshop Kuliner Singkong','desc','Belajar membuat rasi, cireng, kripca, hingga dendeng langsung dari ibu-ibu warga.','image_url',''),
    jsonb_build_object('icon','Leaf','title','Kerajinan Janur & Wayang','desc','Workshop kerajinan dari daun kelapa dan wayang dari daun singkong.','image_url',''),
    jsonb_build_object('icon','Home','title','Homestay Rumah Adat','desc','Menginap di rumah warga dan merasakan langsung kehidupan adat.','image_url',''),
    jsonb_build_object('icon','Camera','title','Situs Meriam Sapu Jagat','desc','Landmark bersejarah di gerbang masuk, saksi bisu perjalanan kampung adat.','image_url',''),
    jsonb_build_object('icon','GraduationCap','title','Edukasi Budaya','desc','Program belajar bersama sesepuh adat untuk pelajar dan komunitas.','image_url',''),
    jsonb_build_object('icon','Sparkles','title','Upacara Adat','desc','Menyaksikan upacara adat seperti Tutup Taun, Ngemban Taun, dan ritual syukuran.','image_url',''),
    jsonb_build_object('icon','Wheat','title','Hamparan Singkong & Pangan Lokal','desc','Menyusuri ladang singkong dan mencicipi pangan lokal dari dapur tradisional.','image_url','')
  )
)),
('reservation_form', jsonb_build_object(
  'title','Reservasi & Hubungi Kami',
  'eyebrow','Lokasi & Kontak',
  'form_title','Formulir Reservasi',
  'form_subtitle','Isi data berikut, tim kami akan menghubungi Anda untuk konfirmasi.',
  'packages', jsonb_build_array(
    jsonb_build_object('value','setengah-hari','label','Paket Setengah Hari (2 aktivitas)'),
    jsonb_build_object('value','satu-hari','label','Paket Satu Hari (3 aktivitas)'),
    jsonb_build_object('value','menginap','label','Paket Menginap (Homestay)'),
    jsonb_build_object('value','konsultasi','label','Konsultasi dulu')
  )
))
ON CONFLICT (key) DO NOTHING;

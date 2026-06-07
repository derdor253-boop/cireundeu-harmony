
ALTER TABLE public.tour_packages ADD COLUMN IF NOT EXISTS image_url text;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tour_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_photos;
ALTER TABLE public.tour_packages REPLICA IDENTITY FULL;
ALTER TABLE public.gallery_photos REPLICA IDENTITY FULL;
INSERT INTO public.registration_codes (code, active, note) VALUES ('CIREUNDEU2026', true, 'Kode pendaftaran umum 2026') ON CONFLICT (code) DO UPDATE SET active = true;

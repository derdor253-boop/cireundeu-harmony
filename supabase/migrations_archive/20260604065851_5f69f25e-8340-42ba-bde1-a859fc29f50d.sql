
CREATE POLICY "public read admin-uploads" ON storage.objects FOR SELECT
  USING (bucket_id = 'admin-uploads');
CREATE POLICY "staff upload admin-uploads" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'admin-uploads' AND public.is_staff(auth.uid()));
CREATE POLICY "staff update admin-uploads" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'admin-uploads' AND public.is_staff(auth.uid()));
CREATE POLICY "staff delete admin-uploads" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'admin-uploads' AND public.is_staff(auth.uid()));

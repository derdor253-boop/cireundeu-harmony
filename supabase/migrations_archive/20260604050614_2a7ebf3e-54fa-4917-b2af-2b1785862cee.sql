
CREATE POLICY "Public read admin-uploads" ON storage.objects FOR SELECT USING (bucket_id = 'admin-uploads');
CREATE POLICY "Admins upload admin-uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'admin-uploads' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins update admin-uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'admin-uploads' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins delete admin-uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'admin-uploads' AND public.is_admin(auth.uid()));

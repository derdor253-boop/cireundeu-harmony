
-- 1) Articles: only show published rows to the public
DROP POLICY IF EXISTS "public read articles" ON public.articles;
CREATE POLICY "public read published articles"
  ON public.articles
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- 2) Explicit admin-only write policies on user_roles (defense-in-depth; trigger uses SECURITY DEFINER)
CREATE POLICY "admins manage user_roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) Lock down SECURITY DEFINER function execution
-- Trigger-only functions: revoke from everyone except the table owner
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- Internal helpers used by RLS policies: anon does not need to call these directly
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;

-- validate_registration_code MUST stay callable by anon (used during signup before auth)
REVOKE ALL ON FUNCTION public.validate_registration_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_registration_code(text) TO anon, authenticated, service_role;

import { supabase } from "@/integrations/supabase/client";

export const ADMIN_BUCKET = "admin-uploads";

/**
 * Resolve a stored media reference to a usable URL.
 * - Returns http(s) URLs as-is.
 * - For storage paths, generates a signed URL (1 hour).
 * - Returns null for empty values.
 */
export async function resolveMediaUrl(value?: string | null): Promise<string | null> {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const { data, error } = await supabase.storage
    .from(ADMIN_BUCKET)
    .createSignedUrl(value, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}

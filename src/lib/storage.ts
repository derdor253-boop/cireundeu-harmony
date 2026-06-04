import { supabase } from "@/integrations/supabase/client";

export const ADMIN_BUCKET = "admin-uploads";

export async function uploadImage(file: File, folder = "umum"): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(ADMIN_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function getSignedUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { data, error } = await supabase.storage
    .from(ADMIN_BUCKET)
    .createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}

export async function deleteImage(path: string | null | undefined) {
  if (!path || path.startsWith("http")) return;
  await supabase.storage.from(ADMIN_BUCKET).remove([path]);
}

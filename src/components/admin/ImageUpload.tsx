import { useEffect, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage, getSignedUrl, deleteImage } from "@/lib/storage";
import { toast } from "sonner";

interface Props {
  value: string | null;
  onChange: (path: string | null) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange, folder = "umum" }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let alive = true;
    getSignedUrl(value).then((u) => alive && setPreview(u));
    return () => {
      alive = false;
    };
  }, [value]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5 MB");
      return;
    }
    setUploading(true);
    try {
      if (value && !value.startsWith("http")) await deleteImage(value);
      const path = await uploadImage(file, folder);
      onChange(path);
      toast.success("Foto berhasil diunggah");
    } catch (err: any) {
      toast.error("Gagal mengunggah foto: " + (err.message || "tidak diketahui"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = async () => {
    if (value && !value.startsWith("http")) await deleteImage(value);
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative w-full max-w-sm overflow-hidden rounded-md border border-border bg-muted">
          <img src={preview} alt="Pratinjau" className="aspect-video w-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="absolute right-2 top-2 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition hover:bg-muted">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="text-sm">Klik untuk pilih foto</span>
              <span className="text-xs">JPG/PNG, maks 5 MB</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
    </div>
  );
}

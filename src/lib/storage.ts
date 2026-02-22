import { supabase } from "@/lib/supabase";

export async function uploadPostImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, file, { upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function deletePostImage(url: string): Promise<void> {
  const bucketPrefix = "/storage/v1/object/public/post-images/";
  const idx = url.indexOf(bucketPrefix);
  if (idx === -1) return;

  const path = url.slice(idx + bucketPrefix.length);
  await supabase.storage.from("post-images").remove([path]);
}

"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { createPost } from "@/hooks/usePosts";
import { PostForm } from "@/components/features/PostForm";
import { ProtectedRoute } from "@/components/features/ProtectedRoute";

export default function NewPostPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  async function handleSubmit(data: { title: string; content: string; tags: string[]; category_id: string | null; image_url: string | null }) {
    if (!user) return;

    const post = await createPost({
      ...data,
      user_id: user.id,
      author_name: user.name || user.email,
    });

    router.push(`/posts/${post.id}`);
  }

  return (
    <ProtectedRoute>
      <h1 className="mb-6 text-2xl font-bold">글 작성</h1>
      <PostForm onSubmit={handleSubmit} />
    </ProtectedRoute>
  );
}

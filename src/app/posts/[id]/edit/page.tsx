"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { usePost, updatePost } from "@/hooks/usePosts";
import { PostForm } from "@/components/features/PostForm";
import { ProtectedRoute } from "@/components/features/ProtectedRoute";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { post, isLoading } = usePost(id);

  async function handleSubmit(data: { title: string; content: string; tags: string[]; category_id: string | null; image_url: string | null }) {
    await updatePost(id, data);
    router.push(`/posts/${id}`);
  }

  if (isLoading) {
    return <div className="py-10 text-center text-gray-500">Loading...</div>;
  }

  if (!post) {
    return <div className="py-10 text-center text-red-500">글을 찾을 수 없습니다.</div>;
  }

  return (
    <ProtectedRoute>
      <h1 className="mb-6 text-2xl font-bold">글 수정</h1>
      <PostForm initialData={post} onSubmit={handleSubmit} submitLabel="수정" />
    </ProtectedRoute>
  );
}

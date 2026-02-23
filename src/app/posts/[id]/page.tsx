"use client";

import { use } from "react";
import { usePost } from "@/hooks/usePosts";
import { PostDetail } from "@/components/features/PostDetail";
import { CommentList } from "@/components/features/CommentList";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { post, isLoading, error } = usePost(id);

  if (isLoading) {
    return <div className="py-10 text-center text-fg-muted">Loading...</div>;
  }

  if (error || !post) {
    return <div className="py-10 text-center text-danger">글을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <PostDetail post={post} />

      <hr className="my-8 border-border" />

      <CommentList postId={post.id} />
    </div>
  );
}

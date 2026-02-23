"use client";

import { PostCard } from "./PostCard";
import type { Post } from "@/types";

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  error?: string | null;
}

export function PostList({ posts, isLoading, error }: PostListProps) {
  if (isLoading) {
    return (
      <div className="py-10 text-center text-fg-muted">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-danger">{error}</div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-10 text-center text-fg-muted">
        아직 작성된 글이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

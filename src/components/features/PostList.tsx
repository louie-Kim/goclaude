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
      <div className="py-10 text-center text-gray-500">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500">{error}</div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        아직 작성된 글이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

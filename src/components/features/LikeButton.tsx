"use client";

import { useLike } from "@/hooks/useLikes";
import { useAuthStore } from "@/stores/auth-store";

interface LikeButtonProps {
  postId: string;
  likeCount: number;
}

export function LikeButton({ postId, likeCount }: LikeButtonProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { liked, count, toggleLike, loading } = useLike(postId, likeCount);

  return (
    <button
      onClick={toggleLike}
      disabled={!isAuthenticated || loading}
      className={`flex items-center gap-1 text-sm transition-colors cursor-pointer ${
        liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
      } disabled:cursor-default`}
      title={isAuthenticated ? (liked ? "좋아요 취소" : "좋아요") : "로그인 후 이용 가능"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}

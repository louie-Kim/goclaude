"use client";

import { useBookmark } from "@/hooks/useBookmarks";
import { useAuthStore } from "@/stores/auth-store";

interface BookmarkButtonProps {
  postId: string;
}

export function BookmarkButton({ postId }: BookmarkButtonProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { bookmarked, toggleBookmark, loading } = useBookmark(postId);

  return (
    <button
      onClick={toggleBookmark}
      disabled={!isAuthenticated || loading}
      className={`flex items-center transition-colors cursor-pointer ${
        bookmarked ? "text-yellow-500" : "text-gray-400 hover:text-yellow-400"
      } disabled:cursor-default`}
      title={isAuthenticated ? (bookmarked ? "북마크 제거" : "북마크") : "로그인 후 이용 가능"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </button>
  );
}

"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useMyBookmarks } from "@/hooks/useBookmarks";
import { PostList } from "@/components/features/PostList";
import { Pagination } from "@/components/ui/Pagination";
import { ProtectedRoute } from "@/components/features/ProtectedRoute";

export default function BookmarksPage() {
  const user = useAuthStore((s) => s.user);
  const [page, setPage] = useState(1);
  const { posts, totalPages, isLoading } = useMyBookmarks(user?.id, page);

  return (
    <ProtectedRoute>
      <div>
        <h1 className="mb-6 text-2xl font-bold">북마크</h1>
        <PostList posts={posts} isLoading={isLoading} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </ProtectedRoute>
  );
}

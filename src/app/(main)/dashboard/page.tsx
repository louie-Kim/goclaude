"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useMyPosts } from "@/hooks/usePosts";
import { PostList } from "@/components/features/PostList";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { ProtectedRoute } from "@/components/features/ProtectedRoute";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [page, setPage] = useState(1);
  const { posts, totalPages, isLoading } = useMyPosts(user?.id, page);

  return (
    <ProtectedRoute>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 글 관리</h1>
        <Link href="/posts/new">
          <Button>글 작성</Button>
        </Link>
      </div>

      <PostList posts={posts} isLoading={isLoading} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </ProtectedRoute>
  );
}

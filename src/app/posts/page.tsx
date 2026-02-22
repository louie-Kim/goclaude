"use client";

import { useState } from "react";
import Link from "next/link";
import { usePosts } from "@/hooks/usePosts";
import { useAuthStore } from "@/stores/auth-store";
import { PostList } from "@/components/features/PostList";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { CategoryFilter } from "@/components/features/CategoryFilter";

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const { posts, totalPages, isLoading, error } = usePosts(page, categoryId);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  function handleCategorySelect(id: string | null) {
    setCategoryId(id);
    setPage(1);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">전체 글</h1>
        {isAuthenticated && (
          <Link href="/posts/new">
            <Button>글 작성</Button>
          </Link>
        )}
      </div>

      <CategoryFilter selected={categoryId} onSelect={handleCategorySelect} />

      <PostList posts={posts} isLoading={isLoading} error={error} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

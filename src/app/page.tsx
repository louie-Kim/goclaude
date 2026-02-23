"use client";

import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { PostList } from "@/components/features/PostList";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryFilter } from "@/components/features/CategoryFilter";
import { HeroSection } from "@/components/features/HeroSection";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const { posts, totalPages, isLoading, error } = usePosts(page, categoryId);

  function handleCategorySelect(id: string | null) {
    setCategoryId(id);
    setPage(1);
  }

  return (
    <div>
      <HeroSection />

      <div className="py-8">
        <CategoryFilter selected={categoryId} onSelect={handleCategorySelect} />
        <PostList posts={posts} isLoading={isLoading} error={error} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

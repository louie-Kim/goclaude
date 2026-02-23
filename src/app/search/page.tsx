"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { PostList } from "@/components/features/PostList";

function SearchResults() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const { results, isLoading } = useSearch(query);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">검색 결과</h1>
        {query && (
          <p className="mt-1 text-sm text-fg-muted">
            &ldquo;{query}&rdquo; 검색 결과 {!isLoading && `(${results.length}건)`}
          </p>
        )}
      </div>
      <PostList posts={results} isLoading={isLoading} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-fg-muted">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}

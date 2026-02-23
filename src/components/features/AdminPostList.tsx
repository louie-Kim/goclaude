"use client";

import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { deletePost } from "@/hooks/usePosts";
import { Pagination } from "@/components/ui/Pagination";

export function AdminPostList() {
  const [page, setPage] = useState(1);
  const { posts, totalPages, isLoading, refetch } = usePosts(page);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 글을 삭제하시겠습니까?`)) return;
    try {
      await deletePost(id);
      refetch();
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  if (isLoading) return <div className="text-fg-muted">글 목록 불러오는 중...</div>;

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-fg-muted">
            <th className="pb-2 font-medium">제목</th>
            <th className="pb-2 font-medium">작성자</th>
            <th className="pb-2 font-medium text-right">좋아요</th>
            <th className="pb-2 font-medium text-right">작성일</th>
            <th className="pb-2 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((p) => (
            <tr key={p.id}>
              <td className="py-2 text-foreground max-w-xs truncate">{p.title}</td>
              <td className="py-2 text-fg-secondary">{p.author_name}</td>
              <td className="py-2 text-right text-fg-secondary">{p.like_count}</td>
              <td className="py-2 text-right text-fg-muted">
                {new Date(p.created_at).toLocaleDateString()}
              </td>
              <td className="py-2 text-right">
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="text-xs text-danger hover:text-danger-hover cursor-pointer"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

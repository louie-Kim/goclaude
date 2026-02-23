"use client";

import { useState } from "react";
import { useUsersList } from "@/hooks/useAdmin";
import { Pagination } from "@/components/ui/Pagination";

export function AdminUserList() {
  const [page, setPage] = useState(1);
  const { users, isLoading } = useUsersList(page);

  if (isLoading) return <div className="text-fg-muted">사용자 목록 불러오는 중...</div>;

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-fg-muted">
            <th className="pb-2 font-medium">이메일</th>
            <th className="pb-2 font-medium">이름</th>
            <th className="pb-2 font-medium text-right">글</th>
            <th className="pb-2 font-medium text-right">댓글</th>
            <th className="pb-2 font-medium text-right">가입일</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="py-2 text-foreground">{u.email}</td>
              <td className="py-2 text-fg-secondary">{u.name ?? "-"}</td>
              <td className="py-2 text-right text-fg-secondary">{u.post_count}</td>
              <td className="py-2 text-right text-fg-secondary">{u.comment_count}</td>
              <td className="py-2 text-right text-fg-muted">
                {new Date(u.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 20 && (
        <div className="mt-4">
          <Pagination currentPage={page} totalPages={page + 1} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

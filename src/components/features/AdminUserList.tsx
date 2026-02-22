"use client";

import { useState } from "react";
import { useUsersList } from "@/hooks/useAdmin";
import { Pagination } from "@/components/ui/Pagination";

export function AdminUserList() {
  const [page, setPage] = useState(1);
  const { users, isLoading } = useUsersList(page);

  if (isLoading) return <div className="text-gray-400">사용자 목록 불러오는 중...</div>;

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-2 font-medium">이메일</th>
            <th className="pb-2 font-medium">이름</th>
            <th className="pb-2 font-medium text-right">글</th>
            <th className="pb-2 font-medium text-right">댓글</th>
            <th className="pb-2 font-medium text-right">가입일</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="py-2 text-gray-700">{u.email}</td>
              <td className="py-2 text-gray-500">{u.name ?? "-"}</td>
              <td className="py-2 text-right text-gray-500">{u.post_count}</td>
              <td className="py-2 text-right text-gray-500">{u.comment_count}</td>
              <td className="py-2 text-right text-gray-400">
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

"use client";

import { useAdminStats } from "@/hooks/useAdmin";

export function AdminStats() {
  const { stats, isLoading } = useAdminStats();

  if (isLoading) return <div className="text-gray-400">통계 불러오는 중...</div>;
  if (!stats) return null;

  const cards = [
    { label: "전체 사용자", value: stats.total_users, sub: `최근 7일 +${stats.recent_users}`, color: "bg-blue-50 border-blue-200" },
    { label: "전체 글", value: stats.total_posts, sub: `최근 7일 +${stats.recent_posts}`, color: "bg-green-50 border-green-200" },
    { label: "전체 댓글", value: stats.total_comments, sub: "", color: "bg-yellow-50 border-yellow-200" },
    { label: "전체 좋아요", value: stats.total_likes, sub: "", color: "bg-red-50 border-red-200" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-lg border p-4 ${c.color}`}>
          <p className="text-xs text-gray-500">{c.label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-800">{c.value.toLocaleString()}</p>
          {c.sub && <p className="mt-1 text-xs text-gray-400">{c.sub}</p>}
        </div>
      ))}
    </div>
  );
}

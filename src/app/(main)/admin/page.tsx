"use client";

import { useState } from "react";
import { AdminGuard } from "@/components/features/AdminGuard";
import { AdminStats } from "@/components/features/AdminStats";
import { AdminUserList } from "@/components/features/AdminUserList";
import { AdminPostList } from "@/components/features/AdminPostList";

type Tab = "stats" | "users" | "posts";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("stats");

  return (
    <AdminGuard>
      <div>
        <h1 className="mb-6 text-2xl font-bold">관리자 페이지</h1>

        <div className="mb-6 flex gap-4 border-b">
          {(["stats", "users", "posts"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 text-sm font-medium cursor-pointer transition-colors ${
                tab === t
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "stats" ? "통계" : t === "users" ? "사용자" : "글 관리"}
            </button>
          ))}
        </div>

        {tab === "stats" && <AdminStats />}
        {tab === "users" && <AdminUserList />}
        {tab === "posts" && <AdminPostList />}
      </div>
    </AdminGuard>
  );
}

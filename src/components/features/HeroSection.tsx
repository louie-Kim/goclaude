"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/features/SearchBar";

export function HeroSection() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <section
      className="relative border-b border-border overflow-hidden"
      style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}
    >
      {/* Full-width gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent-teal/10 to-accent-purple/10" />

      <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-fg-secondary backdrop-blur-sm">
          ✨ 스크립트 공유 플랫폼
        </div>

        {/* H1 */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
          블로그를 더 쉽게,<br /> 더 즐겁게
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-fg-secondary max-w-2xl mb-8">
          커뮤니티와 함께 지식을 나누세요. 누구든 글을 쓰고, 발견하고, 서로 연결됩니다.
        </p>

        {/* CTA + Search */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/posts/new">
              <Button>글 작성하기</Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button>시작하기</Button>
            </Link>
          )}
          <Link href="/posts">
            <Button variant="secondary">둘러보기</Button>
          </Link>
          <SearchBar />
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "./Button";
import { SearchBar } from "@/components/features/SearchBar";
import { useAdmin } from "@/hooks/useAdmin";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isAdmin } = useAdmin();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          BlogPoster
        </Link>

        <nav className="flex items-center gap-4">
          <SearchBar />

          <Link href="/posts" className="text-sm text-gray-600 hover:text-black">
            Posts
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/bookmarks" className="text-sm text-gray-600 hover:text-black">
                북마크
              </Link>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black">
                My Page
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  관리자
                </Link>
              )}
              <span className="text-sm text-gray-400">{user?.email}</span>
              <Button variant="secondary" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

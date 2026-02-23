"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "./Button";
import { useAdmin } from "@/hooks/useAdmin";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isAdmin } = useAdmin();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-500 via-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">
          BlogPoster
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/posts" className="text-sm text-fg-secondary hover:text-foreground">
            Posts
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/bookmarks" className="text-sm text-fg-secondary hover:text-foreground">
                북마크
              </Link>
              <Link href="/dashboard" className="text-sm text-fg-secondary hover:text-foreground">
                My Page
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm text-accent-purple hover:text-accent font-medium">
                  관리자
                </Link>
              )}
              <span className="text-sm text-fg-muted">{user?.email}</span>
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

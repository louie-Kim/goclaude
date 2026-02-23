"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { useAuthStore } from "@/stores/auth-store";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const { isAdmin } = useAdmin();

  if (isLoading) {
    return <div className="py-20 text-center text-fg-muted">Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-foreground">접근 권한이 없습니다.</p>
        <p className="mt-1 text-sm text-fg-muted">관리자만 이 페이지에 접근할 수 있습니다.</p>
      </div>
    );
  }

  return <>{children}</>;
}

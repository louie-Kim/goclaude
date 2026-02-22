"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import type { AdminStats, AdminUser } from "@/types";

export function useAdmin() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false);
      return;
    }

    async function check() {
      const { data } = await supabase.rpc("is_admin");
      setIsAdmin(!!data);
    }

    check();
  }, [isAuthenticated]);

  return { isAdmin };
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.rpc("get_admin_stats");
      if (data && data.length > 0) setStats(data[0] as AdminStats);
      setIsLoading(false);
    }

    fetch();
  }, []);

  return { stats, isLoading };
}

export function useUsersList(page = 1) {
  const PAGE_SIZE = 20;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      const { data } = await supabase.rpc("get_users_list", {
        page_limit: PAGE_SIZE,
        page_offset: (page - 1) * PAGE_SIZE,
      });
      setUsers((data as AdminUser[]) ?? []);
      setIsLoading(false);
    }

    fetch();
  }, [page]);

  return { users, isLoading };
}

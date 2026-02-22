"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import type { Post } from "@/types";

const PAGE_SIZE = 10;

export function useBookmark(postId: string) {
  const user = useAuthStore((s) => s.user);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function check() {
      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user!.id)
        .maybeSingle();

      setBookmarked(!!data);
    }

    check();
  }, [postId, user]);

  async function toggleBookmark() {
    if (!user || loading) return;
    setLoading(true);

    if (bookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
      setBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({ post_id: postId, user_id: user.id });
      setBookmarked(true);
    }

    setLoading(false);
  }

  return { bookmarked, toggleBookmark, loading };
}

export function useMyBookmarks(userId: string | undefined | null, page = 1) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    if (!userId) return;

    async function fetch() {
      setIsLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Fetch bookmark post IDs first, then fetch posts
      const { data: bmData, count } = await supabase
        .from("bookmarks")
        .select("post_id", { count: "exact" })
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .range(from, to);

      const postIds = (bmData ?? []).map((b) => b.post_id);
      if (postIds.length === 0) {
        setPosts([]);
        setTotal(count ?? 0);
        setIsLoading(false);
        return;
      }

      const { data: postData } = await supabase
        .from("posts")
        .select("*, category:categories(id,name,slug,color,sort_order)")
        .in("id", postIds);

      setPosts((postData as unknown as Post[]) ?? []);
      setTotal(count ?? 0);
      setIsLoading(false);
    }

    fetch();
  }, [userId, page]);

  return { posts, total, totalPages, isLoading };
}

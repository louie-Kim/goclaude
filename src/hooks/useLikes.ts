"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";

export function useLike(postId: string, initialCount: number) {
  const user = useAuthStore((s) => s.user);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (!user) return;

    async function checkLiked() {
      const { data } = await supabase
        .from("likes")
        .select("post_id")
        .eq("post_id", postId)
        .eq("user_id", user!.id)
        .maybeSingle();

      setLiked(!!data);
    }

    checkLiked();
  }, [postId, user]);

  async function toggleLike() {
    if (!user || loading) return;
    setLoading(true);

    if (liked) {
      await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id);
      setLiked(false);
      setCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
      setLiked(true);
      setCount((c) => c + 1);
    }

    setLoading(false);
  }

  return { liked, count, toggleLike, loading };
}

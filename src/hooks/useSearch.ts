"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/types";

export function useSearch(query: string) {
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setIsLoading(true);

      const { data } = await supabase.rpc("search_posts", {
        search_query: trimmed,
        result_limit: 20,
      });

      setResults((data as Post[]) ?? []);
      setIsLoading(false);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  return { results, isLoading };
}

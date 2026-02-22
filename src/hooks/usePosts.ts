"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Post, CreatePostInput, UpdatePostInput } from "@/types";

const PAGE_SIZE = 10;

export function usePosts(page = 1, categoryId: string | null = null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("posts")
      .select("*, category:categories(id,name,slug,color,sort_order)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error: err, count } = await query;

    if (err) {
      setError(err.message);
    } else {
      setPosts(data as unknown as Post[]);
      setTotal(count ?? 0);
    }

    setIsLoading(false);
  }, [page, categoryId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, total, totalPages, isLoading, error, refetch: fetchPosts };
}

export function usePost(id: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data, error: err } = await supabase
        .from("posts")
        .select("*, category:categories(id,name,slug,color,sort_order)")
        .eq("id", id)
        .single();

      if (err) {
        setError(err.message);
      } else {
        setPost(data as unknown as Post);
      }
      setIsLoading(false);
    }

    fetch();
  }, [id]);

  return { post, isLoading, error };
}

export function useMyPosts(userId: string | undefined | null, page = 1) {
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

      const { data, count } = await supabase
        .from("posts")
        .select("*, category:categories(id,name,slug,color,sort_order)", { count: "exact" })
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .range(from, to);

      setPosts((data as unknown as Post[]) ?? []);
      setTotal(count ?? 0);
      setIsLoading(false);
    }

    fetch();
  }, [userId, page]);

  return { posts, total, totalPages, isLoading };
}

export async function createPost(input: CreatePostInput & { user_id: string; author_name: string }) {
  const { data, error } = await supabase
    .from("posts")
    .insert(input)
    .select("*, category:categories(id,name,slug,color,sort_order)")
    .single();

  if (error) throw error;
  return data as unknown as Post;
}

export async function updatePost(id: string, input: UpdatePostInput) {
  const { data, error } = await supabase
    .from("posts")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, category:categories(id,name,slug,color,sort_order)")
    .single();

  if (error) throw error;
  return data as unknown as Post;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

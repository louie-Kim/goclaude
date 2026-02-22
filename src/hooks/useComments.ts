"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Comment } from "@/types";

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);

    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    setComments((data as Comment[]) ?? []);
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, isLoading, refetch: fetchComments };
}

export async function createComment(input: {
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comments")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
}

export async function deleteComment(id: string) {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}

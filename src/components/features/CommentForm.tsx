"use client";

import { useState, FormEvent } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { createComment } from "@/hooks/useComments";
import { Button } from "@/components/ui/Button";

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-gray-500">
        댓글을 작성하려면 로그인이 필요합니다.
      </p>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      await createComment({
        post_id: postId,
        user_id: user.id,
        author_name: user.name || user.email,
        content: content.trim(),
      });
      setContent("");
      onCommentAdded();
    } catch {
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        maxLength={500}
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
        required
      />
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "..." : "등록"}
      </Button>
    </form>
  );
}

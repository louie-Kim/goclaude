"use client";

import { useAuthStore } from "@/stores/auth-store";
import { deleteComment } from "@/hooks/useComments";
import type { Comment } from "@/types";

interface CommentItemProps {
  comment: Comment;
  onDeleted: () => void;
}

export function CommentItem({ comment, onDeleted }: CommentItemProps) {
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.id === comment.user_id;

  async function handleDelete() {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(comment.id);
      onDeleted();
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface-alt p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-fg-muted">
          {comment.author_name} &middot;{" "}
          {new Date(comment.created_at).toLocaleDateString()}
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-sm text-danger hover:underline"
          >
            삭제
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-foreground">{comment.content}</p>
    </div>
  );
}

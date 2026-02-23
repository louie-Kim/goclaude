"use client";

import { useComments } from "@/hooks/useComments";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";

interface CommentListProps {
  postId: string;
}

export function CommentList({ postId }: CommentListProps) {
  const { comments, isLoading, refetch } = useComments(postId);

  return (
    <div>
      <h2 className="text-lg font-semibold">
        댓글 ({comments.length}개)
      </h2>

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <p className="text-sm text-fg-muted">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-fg-muted">아직 댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onDeleted={refetch} />
          ))
        )}
      </div>

      <div className="mt-4">
        <CommentForm postId={postId} onCommentAdded={refetch} />
      </div>
    </div>
  );
}

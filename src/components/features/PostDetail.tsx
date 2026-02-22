"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { deletePost } from "@/hooks/usePosts";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LikeButton } from "@/components/features/LikeButton";
import { BookmarkButton } from "@/components/features/BookmarkButton";
import type { Post } from "@/types";

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.id === post.user_id;

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deletePost(post.id);
      router.push("/posts");
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <article>
      {post.image_url && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <Image
            src={post.image_url}
            alt={post.title}
            width={900}
            height={400}
            className="w-full object-cover max-h-80"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        {post.category && (
          <Badge label={post.category.name} color={post.category.color} />
        )}
      </div>

      <h1 className="text-3xl font-bold">{post.title}</h1>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {post.author_name} &middot;{" "}
          {new Date(post.created_at).toLocaleDateString()}
        </div>

        <div className="flex items-center gap-3">
          <LikeButton postId={post.id} likeCount={post.like_count} />
          <BookmarkButton postId={post.id} />

          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/posts/${post.id}/edit`}>
                <Button variant="secondary" size="sm">수정</Button>
              </Link>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          )}
        </div>
      </div>

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <hr className="my-6 border-gray-200" />

      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {post.content}
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LikeButton } from "@/components/features/LikeButton";
import { BookmarkButton } from "@/components/features/BookmarkButton";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="transition-colors hover:border-gray-400">
        {post.image_url && (
          <div className="mb-3 -mx-6 -mt-6 overflow-hidden rounded-t-lg">
            <Image
              src={post.image_url}
              alt={post.title}
              width={800}
              height={200}
              className="h-40 w-full object-cover"
            />
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {post.category && (
                <Badge label={post.category.name} color={post.category.color} />
              )}
              <h2 className="text-lg font-semibold text-gray-900 truncate">{post.title}</h2>
            </div>
          </div>
          <div className="text-sm text-gray-400 whitespace-nowrap ml-4">
            {post.author_name} &middot;{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.content}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2" onClick={(e) => e.preventDefault()}>
            <LikeButton postId={post.id} likeCount={post.like_count} />
            <BookmarkButton postId={post.id} />
          </div>
        </div>
      </Card>
    </Link>
  );
}

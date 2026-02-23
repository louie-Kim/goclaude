"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { LikeButton } from "@/components/features/LikeButton";
import { BookmarkButton } from "@/components/features/BookmarkButton";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="flex flex-col h-full">
      <div className="rounded-xl border border-white/5 bg-surface/40 backdrop-blur-md shadow-xl hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
        {post.image_url && (
          <div className="overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.title}
              width={800}
              height={200}
              className="h-40 w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 p-6 space-y-3">
          {/* Category + title */}
          <div>
            {post.category && (
              <div className="mb-2">
                <Badge label={post.category.name} color={post.category.color} />
              </div>
            )}
            <h2 className="text-lg font-semibold text-foreground line-clamp-2">{post.title}</h2>
          </div>

          {/* Excerpt */}
          <p className="line-clamp-2 text-sm text-fg-secondary flex-1">{post.content}</p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-overlay px-2.5 py-0.5 text-xs text-fg-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer: author + actions */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-xs text-fg-muted">
              {post.author_name} &middot; {new Date(post.created_at).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
              <LikeButton postId={post.id} likeCount={post.like_count} />
              <BookmarkButton postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

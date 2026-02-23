"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { CategorySelect } from "@/components/features/CategorySelect";
import { ImageUpload } from "@/components/features/ImageUpload";
import type { Post } from "@/types";

interface PostFormProps {
  initialData?: Post;
  onSubmit: (data: { title: string; content: string; tags: string[]; category_id: string | null; image_url: string | null }) => Promise<void>;
  submitLabel?: string;
}

export function PostForm({ initialData, onSubmit, submitLabel = "발행" }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(initialData?.category_id ?? null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url ?? null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({ title, content, tags, category_id: categoryId, image_url: imageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="글 제목을 입력하세요"
          maxLength={200}
          required
        />

        <CategorySelect value={categoryId} onChange={setCategoryId} />

        <ImageUpload value={imageUrl} onChange={setImageUrl} />

        <Textarea
          label="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="글 내용을 작성하세요"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-fg-secondary">태그</label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="태그 입력 후 추가"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={addTag}>
              추가
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-overlay px-3 py-1 text-sm text-fg-secondary"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-fg-muted hover:text-fg-secondary"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "저장 중..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}

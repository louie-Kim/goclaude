"use client";

import { useCategories } from "@/hooks/useCategories";

interface CategorySelectProps {
  value: string | null;
  onChange: (categoryId: string | null) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { categories, isLoading } = useCategories();

  if (isLoading) return null;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">카테고리</label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
      >
        <option value="">카테고리 선택 (선택사항)</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}

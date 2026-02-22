"use client";

import { useCategories } from "@/hooks/useCategories";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { categories, isLoading } = useCategories();

  if (isLoading) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors cursor-pointer ${
          selected === null
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors cursor-pointer ${
            selected === cat.id ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          style={selected === cat.id ? { backgroundColor: cat.color } : undefined}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

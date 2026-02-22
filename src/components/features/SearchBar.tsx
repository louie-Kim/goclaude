"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색..."
          className="rounded-lg border border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black w-40 focus:w-52 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </form>
  );
}

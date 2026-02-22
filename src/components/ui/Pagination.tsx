"use client";

import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        &lt; Prev
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "primary" : "secondary"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next &gt;
      </Button>
    </div>
  );
}

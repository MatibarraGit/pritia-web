"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePagination } from "@/hooks";

interface PaginationProps {
  totalPages: number;
  className?: string;
}

export function Pagination({ totalPages, className }: PaginationProps) {
  const { currentPage, generatePagination, createPageUrl } = usePagination({ totalPages });

  return (
    <nav className={className}>
      <ul className="flex items-center gap-2">
        {currentPage !== 1 && (
          <li>
            <Link
              href={createPageUrl(currentPage - 1)}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Página anterior"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </li>
        )}

        {generatePagination(currentPage).map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="flex items-center justify-center w-8 h-8 text-gray-400">
                ...
              </span>
            ) : (
              <Link
                href={createPageUrl(page)}
                className={`flex items-center justify-center w-8 h-8 rounded-md border transition-colors ${
                  page === currentPage
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {currentPage !== totalPages && (
          <li>
            <Link
              href={createPageUrl(currentPage + 1)}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Página siguiente"
            >
              <ArrowRight className="size-4" />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}


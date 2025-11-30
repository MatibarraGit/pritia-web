"use client";

import { usePathname, useSearchParams } from "next/navigation";

interface UsePaginationProps {
  totalPages: number;
}

interface UsePaginationReturn {
  currentPage: number;
  generatePagination: (currentPage: number) => (number | string)[];
  createPageUrl: (pageNumber: number | string) => string;
}

export const usePagination = ({ totalPages }: UsePaginationProps): UsePaginationReturn => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const pageString = searchParams.get('page') ?? '1';
  const currentPage = isNaN(+pageString) ? 1 : +pageString;
  
  // Generar los números para los botones de la paginación
  const generatePagination = (currentPage: number): (number | string)[] => {
    // Si el total de página es menor o igual que 6
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    // Si está en las primeras 3 páginas
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages - 1, totalPages];
    }
  
    // Si está en las últimas 3 páginas
    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }
  
    // Si está en páginas intermedias
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };
  
  // Generar los números para los links de la paginación
  const createPageUrl = (pageNumber: number | string): string => {
    const params = new URLSearchParams(searchParams);
  
    // Regresar el mismo url en el que se encuentra si toca los 3 puntitos
    if (pageNumber === '...') {
      return '#';
    }
  
    const pageNum = typeof pageNumber === 'number' ? pageNumber : +pageNumber;
    
    if (pageNum <= 0) {
      return '#';
    }
  
    if (pageNum > totalPages) {
      return `${pathname}?${params.toString()}`;
    }
  
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return { currentPage, generatePagination, createPageUrl };
};


'use client'

import { useEffect } from "react";

import { PageLoader, ShowProducts } from "@/components";
import { useFetchProductsBySearch, useFiltersContext, useOrderContext } from "@/hooks";

import { NoSearchResults } from "./noSearchResults";

interface SearchPageProps {
  search: string;
}

export default function SearchPage({ search }: SearchPageProps) {
  const { products, type, isLoading } = useFetchProductsBySearch(search);
  const { resetOrderObject } = useOrderContext();
  const { resetFilters } = useFiltersContext();
  const hasProductsCoincidences = type === 'exact';
  
  useEffect(() => {
    resetOrderObject();
    resetFilters();
  }, [search, resetFilters, resetOrderObject]);

  if (isLoading) return <PageLoader text='Productos' />;
  if (!hasProductsCoincidences) return <NoSearchResults search={search} products={products} />;

  const totalProducts = products?.length;

  return (
    <ShowProducts 
      products={products} 
      totalProducts={totalProducts} 
      search={search} 
    />
  );
}


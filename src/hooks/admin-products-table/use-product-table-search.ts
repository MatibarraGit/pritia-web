"use client";

import { useCallback, useMemo, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFiltersContext } from "../use-filters-context";

export function useProductTableSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { clearFilter } = useFiltersContext()

  const search = useMemo(() => searchParams.get("search") || "", [searchParams]);

  const replaceWithParams = useCallback(
    (params: URLSearchParams) => {
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router]
  );

  const handleSearch = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      const formData = new FormData(event.currentTarget);
      const searchValue = String(formData.get("search") || "");
      const params = new URLSearchParams(searchParams.toString());
      
      params.set("page", "1")
      
      if (searchValue) params.set("search", searchValue);
      else params.delete("search");
      
      replaceWithParams(params);
      clearFilter("productsClientSearch");
    },
    [replaceWithParams, searchParams, clearFilter]
  );

  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    replaceWithParams(params);
    clearFilter("productsClientSearch");
  }, [replaceWithParams, searchParams, clearFilter]);

  return {
    search,
    handleSearch,
    clearSearch,
  };
}

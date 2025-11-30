"use client";

import { useEffect, useState } from "react";
import { fetchAllCategories, fetchAllProviders } from "@/services";
import type { CategoryType, Provider } from "@/types";

export function useAsyncData() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    async function getProviders() {
      const providersArray = await fetchAllProviders();
      if (providersArray) {
        setProviders(providersArray);
      }
    }

    async function getCategories() {
      const categoriesArray = await fetchAllCategories();
      if (categoriesArray) {
        setCategories(categoriesArray);
      }
    }

    getProviders();
    getCategories();
  }, []);

  return { providers, categories };
}





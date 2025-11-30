"use server";

import type { CategoryType } from "@/types";

export async function fetchAllCategories(): Promise<CategoryType[] | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    const categories: CategoryType[] = await response.json();
    
    return categories
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return null;
  }
}




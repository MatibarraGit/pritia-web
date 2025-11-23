"use client";

import Link from "next/link";

import { cn } from '@/libs/utils';
import { useFetchData } from '@/hooks';
import { CategoryType } from "@/types";

const fetchCategories = async (): Promise<CategoryType[] | null> => {
  const response = await fetch("/api/categories");
  const data = await response.json();
  return data || [];
}

export const ProductCategories = () => {
  const { data: categories, isLoading } = useFetchData<CategoryType[]>({ fetchFunction: fetchCategories });

  if (isLoading) {
    return (
      <section className="w-11/12 max-width-screen py-8 mx-auto">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">Cargando categorías...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  // TODO: Hacerlo un Carousel
  return (
    <section className="w-11/12 max-width-screen py-8 mx-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.category_id}
              href={`/products?category=${category.category_name}`}
              className={cn(
                "group relative overflow-hidden rounded-lg shadow-md transition-transform hover:transform hover:scale-105 bg-linear-to-br from-primary/20 to-secondary/20"
              )}
            >
              <div className="aspect-square w-full flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <div className="relative z-10 text-center">
                  <p className="font-medium text-white text-lg">{category.category_name}</p>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <p className="text-white/80 text-xs mt-1">
                      {category.subcategories.length} {category.subcategories.length === 1 ? 'subcategoría' : 'subcategorías'}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
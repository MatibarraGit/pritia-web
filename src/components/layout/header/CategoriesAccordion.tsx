// TODO: Solucionar el warning de setState dentro de un effect
// TODO: Agregar fondo, bordes y sombras a los elementos del accordion
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFetchData } from "@/hooks";
import { CategoryType } from "@/types";
import { cn } from "@/libs/utils";

const fetchCategories = async (): Promise<CategoryType[] | null> => {
  const response = await fetch("/api/categories");
  const data = await response.json();
  return data || [];
};

interface CategoriesAccordionProps {
  closeMenuOnClick?: boolean;
}

export const CategoriesAccordion = ({ closeMenuOnClick = true }: CategoriesAccordionProps) => {
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentSubcategory, setCurrentSubcategory] = useState("");

  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category");
  const subcategory = params.get("subcategory");

  const { data: categories, isLoading } = useFetchData<CategoryType[]>({
    fetchFunction: fetchCategories,
  });

  useEffect(() => {
    setCurrentCategory("");
    setCurrentSubcategory("");
    if (!category) return;
    setCurrentCategory(category);

    if (!subcategory) return;
    setCurrentSubcategory(subcategory);
  }, [category, subcategory]);

  const categoriesList = categories || [];

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/products?category=${encodeURIComponent(categoryName)}`);
    if (closeMenuOnClick) {
      const checkbox = document.getElementById("header__open-menu") as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = false;
        document.body.classList.remove("overflow-hidden");
      }
    }
  };

  const handleSubcategoryClick = (categoryName: string, subcategoryName: string) => {
    router.push(
      `/products?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subcategoryName)}`
    );
    if (closeMenuOnClick) {
      const checkbox = document.getElementById("header__open-menu") as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = false;
        document.body.classList.remove("overflow-hidden");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 text-center text-sm text-gray-500">
        Cargando categorías...
      </div>
    );
  }

  if (categoriesList.length === 0) {
    return (
      <div className="w-full p-4 text-center text-sm text-gray-500">
        No hay categorías disponibles
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="categories">
        <AccordionTrigger className="text-base font-medium hover:no-underline">
          Categorías
        </AccordionTrigger>
        <AccordionContent>
          <Accordion type="multiple" className="w-full">
            {categoriesList.map((categoryItem) => (
              <AccordionItem
                key={categoryItem.category_id}
                value={categoryItem.category_name}
                className="border-b border-gray-200"
              >
                <AccordionTrigger
                  className={cn(
                    "text-sm font-medium hover:no-underline py-2",
                    currentCategory === categoryItem.category_name && "text-primary font-semibold"
                  )}
                >
                  {categoryItem.category_name}
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="flex flex-col gap-1 pl-4">
                    {categoryItem.subcategories?.map((subcategoryItem) => (
                      <button
                        key={subcategoryItem.id}
                        type="button"
                        onClick={() => handleSubcategoryClick(categoryItem.category_name, subcategoryItem.name)}
                        className={cn(
                          "w-full text-left text-sm py-2 px-2 rounded cursor-pointer transition-colors hover:bg-gray-100",
                          currentSubcategory === subcategoryItem.name && "text-primary font-semibold bg-gray-50"
                        )}
                      >
                        {subcategoryItem.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(categoryItem.category_name)}
                      className="w-full text-left text-sm py-2 px-2 rounded cursor-pointer transition-colors hover:bg-gray-100 text-primary font-medium"
                    >
                      Ver todo
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};


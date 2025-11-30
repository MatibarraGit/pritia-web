"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { menuMobileContext } from "@/contexts";
import { useFetchData } from "@/hooks";
import { CategoryType } from "@/types";
import { cn } from "@/libs/utils";
import { fetchAllCategories } from "@/services";

interface CategoriesAccordionProps {
  closeMenuOnClick?: boolean;
}

export const CategoriesAccordion = ({ closeMenuOnClick = true }: CategoriesAccordionProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") || "";
  const subcategory = params.get("subcategory") || "";
  const { closeMenu } = menuMobileContext();

  const { data: categories, isLoading } = useFetchData<CategoryType[]>({
    fetchFunction: fetchAllCategories,
  });

  const categoriesList = categories || [];

  const handleCategoryClick = (categoryName: string) => {
    if (closeMenuOnClick) {
      closeMenu();
    }
    router.push(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handleSubcategoryClick = (categoryName: string, subcategoryName: string) => {
    if (closeMenuOnClick) {
      closeMenu();
    }
    router.push(
      `/products?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subcategoryName)}`
    );
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
      <AccordionItem value="categories" className="border border-gray-200 rounded-md bg-white shadow-sm">
        <AccordionTrigger 
          className="flex py-3 px-3 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
        >
          Categorías
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <Accordion type="multiple" className="w-full">
            {categoriesList.map((categoryItem) => (
              <AccordionItem
                key={categoryItem.category_id}
                value={categoryItem.category_name}
                className="border border-gray-200 rounded-md bg-gray-50 shadow-sm mb-2 last:mb-0"
              >
                <AccordionTrigger
                  className={cn(
                    "text-sm font-medium hover:no-underline py-2.5 px-3 rounded-md",
                    category === categoryItem.category_name && "text-primary font-semibold bg-white"
                  )}
                >
                  {categoryItem.category_name}
                </AccordionTrigger>
                <AccordionContent className="pb-3 px-3">
                  <div className="flex flex-col gap-1 bg-white rounded-md border border-gray-100 p-2">
                    {categoryItem.subcategories?.map((subcategoryItem) => (
                      <button
                        key={subcategoryItem.id}
                        type="button"
                        onClick={() => handleSubcategoryClick(categoryItem.category_name, subcategoryItem.name)}
                        className={cn(
                          "w-full text-left text-sm py-2 px-3 rounded-md cursor-pointer transition-colors hover:bg-gray-100",
                          subcategory === subcategoryItem.name && "text-primary font-semibold bg-gray-50"
                        )}
                      >
                        {subcategoryItem.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(categoryItem.category_name)}
                      className="w-full text-left text-sm py-2 px-3 rounded-md cursor-pointer transition-colors hover:bg-gray-100 text-primary font-semibold border-t border-gray-200 mt-1 pt-2"
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


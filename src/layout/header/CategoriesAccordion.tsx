/* eslint-disable @next/next/no-img-element */
// TODO: Manejar los filtros ¿En backend o en frontend?
// ? Utilizar handleFilterChange cuando hay una búsqueda o una categoría, y utilizar un Link cuando es todos los productos
"use client";

import { useSearchParams } from "next/navigation";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { menuMobileContext } from "@/contexts";
import { useCategoriesMenu, useFetchData, useFiltersContext } from "@/hooks";
import { CategoryType } from "@/types";
import { cn } from "@/libs/utils";
import { fetchAllCategories } from "@/services";

interface CategoriesAccordionProps {
  isMenuMobile?: boolean;
  closeMenuOnClick?: boolean;
}

export const CategoriesAccordion = ({ isMenuMobile = false, closeMenuOnClick = true }: CategoriesAccordionProps) => {
  const params = useSearchParams();
  const subcategory = params.get("subcategory") || "";
  const { closeMenu } = menuMobileContext();
  // const { handleFilterChange } = useFiltersContext()
  const { handleCategoryClick } = useCategoriesMenu({ closeMenuOnClick, closeMenu })

  const { data: categories, isLoading } = useFetchData<CategoryType[]>({
    fetchFunction: fetchAllCategories,
  });

  const categoriesList = categories || [];

  // function onClickFunction(subcategoryName: string, categoryName: string) {
  //   if (!!isMenuMobile) return handleSubcategoryClick(categoryName, subcategoryName)
  //   else return handleFilterChange("subcategory", subcategoryName)
  // }

  if (isLoading) {
    return (
      <div className="w-full p-4 text-center text-sm text-gray-500">
        Cargando categorías...
      </div>
    );
  }

  // if (categoriesList.length === 0) {
  //   return (
  //     <div className="w-full p-4 text-center text-sm text-gray-500">
  //       No hay categorías disponibles
  //     </div>
  //   );
  // }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="categories">
        <AccordionTrigger 
          className={cn(
            "flex items-center text-base hover:text-primary rounded-md transition-colors hover:no-underline",
            isMenuMobile 
              ? "py-3 px-1 hover:bg-gray-50 font-body" 
              : "p-0 font-semibold text-black font-subheading"
          )}
        >
          <div className="flex items-center gap-2">
            <img src="/icons/categories.svg" alt="Categorías" width={24} height={24} />
            <span>Categorías</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-3 max-h-80 overflow-y-scroll personalized-scrollbar">
          <Accordion type="multiple" className="w-full">
            {categoriesList.map((categoryItem) => (
              <div 
                key={categoryItem.category_id}
                className={cn(
                  "flex flex-col",
                  isMenuMobile ? "px-3" : "px-2"
                )}
              >
                {categoryItem.subcategories?.map((subcategoryItem) => (
                  <button 
                    key={subcategoryItem.id}
                    className={cn(
                      "w-fit py-2 flex flex-col justify-start text-sm hover:text-primary text-start",
                      subcategory === subcategoryItem.name && "text-primary font-semibold"
                    )}
                    onClick={() => handleCategoryClick(categoryItem.category_name, subcategoryItem.name)}
                  >
                    {subcategoryItem.name}
                  </button>
                ))}
              </div>
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};


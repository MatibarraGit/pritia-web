"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";

import { useCategoriesMenu, useFetchData } from "@/hooks";
import { CategoryType } from "@/types";
import { cn } from "@/libs/utils";
import { toSlug } from "@/utils";
import { fetchAllCategories } from "@/services";

export const CategoriesDropdown = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const dropdownRef = useRef<HTMLElement>(null);

  useCategoriesMenu({ closeMenuOnClick: false, closeMenu: () => {} });
  const { data: categories, isLoading } = useFetchData<CategoryType[]>({ 
    fetchFunction: fetchAllCategories 
  });

  const categoriesList = categories || [];

  return (
    <>
      <li
        className="w-fit py-3 cursor-pointer relative flex items-center gap-1"
        onMouseEnter={() => setIsOverlayOpen(true)}
        onMouseLeave={() => setIsOverlayOpen(false)}
      >
        <label className="text-sm cursor-pointer">Categorías</label>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isOverlayOpen && "rotate-180"
          )} 
        />
        
        {/* Dropdown Container */}
        <article 
          ref={dropdownRef}
          className={cn(
            "w-[250px] py-1 hidden flex-col items-start gap-0",
            "absolute top-[40px] left-[-10px] z-20",
            "bg-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-[10px] text-sm rounded-md border border-gray-200",
            "before:content-[''] before:w-0 before:h-0 before:absolute before:top-[-8px] before:left-5",
            "before:border-l-8 before:border-r-8 before:border-b-8",
            "before:border-l-transparent before:border-r-transparent before:border-b-white",
            isOverlayOpen && "flex animate-[dropdownFadeIn_0.3s_ease]"
          )}
        >
          {isLoading ? (
            <div className="w-full h-[100px] flex items-center justify-center">
              <p className="text-sm text-gray-500">Cargando categorías...</p>
            </div>
          ) : categoriesList.length === 0 ? (
            <div className="w-full p-4 text-center text-sm text-gray-500">
              No hay categorías disponibles
            </div>
          ) : (
            categoriesList.map((category) => (
              <div
                key={category.category_id}
                className="w-full px-4 py-2 flex items-center justify-between transition-all duration-200 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 group"
              >
                <div className="w-full flex items-center justify-between">
                  <Link
                    href={`/productos/${toSlug(category.category_name)}`}
                    className="font-medium text-gray-700 transition-all duration-200 group-hover:text-primary group-hover:translate-x-1 no-underline"
                  >
                    {category.category_name}
                  </Link>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <ChevronRight 
                      size={12} 
                      className="text-gray-400 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5" 
                    />
                  )}
                </div>

                {/* Subcategorías */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div 
                    className="min-w-[250px] h-full hidden flex-col gap-0 absolute left-full top-0 z-10 bg-white border border-gray-200 shadow-md text-sm rounded-r-md group-hover:flex"
                  >
                    <div className="flex flex-col h-full">
                      <div className="py-1 flex-1 flex flex-col overflow-y-auto">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/productos/${toSlug(category.category_name)}/${toSlug(subcategory.name)}`}
                            className="w-full px-4 py-2 group/subcategory text-gray-700 font-medium text-start no-underline border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 hover:text-primary shrink-0"
                          >
                            <span className="inline-block transition-transform duration-200 group-hover/subcategory:translate-x-1">
                              {subcategory.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={`/productos/${toSlug(category.category_name)}`}
                        className="w-full px-4 py-2.5 text-primary font-subheading no-underline border-t border-gray-200 transition-all duration-200 hover:bg-gray-50 shrink-0"
                      >
                        <span className="inline-block transition-transform duration-200 hover:translate-x-1">
                          Ver todo
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </article>
      </li>
      
      {/* Overlay para desktop - fuera del li */}
      <CategoriesOverlay open={isOverlayOpen} />
    </>
  );
};

function CategoriesOverlay({ open }: { open: boolean }) {
  if (!open || typeof window === 'undefined') return null;
  
  return createPortal(
    <div
      className="fixed left-0 w-screen bg-black/30 z-9 pointer-events-none"
      style={{
        top: "116px",
        height: "calc(100vh - 115px)",
      }}
    />,
    document.body
  );
}
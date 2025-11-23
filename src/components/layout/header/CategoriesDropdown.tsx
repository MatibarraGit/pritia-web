// TODO: Arreglar los colores de las categorías y subcategorías
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";

import { useFetchData } from "@/hooks";
import { CategoryType } from "@/types";
import { cn } from "@/libs/utils";

const fetchCategories = async (): Promise<CategoryType[] | null> => {
  const response = await fetch("/api/categories");
  const data = await response.json();
  return data || [];
};

export const CategoriesDropdown = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { data: categories, isLoading } = useFetchData<CategoryType[]>({ 
    fetchFunction: fetchCategories 
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
        <article className={cn(
          "w-[250px] py-1 hidden flex-col items-start gap-0",
          "absolute top-[45px] left-[-10px] z-20",
          "bg-gray-50 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-[10px] text-sm",
          "before:content-[''] before:w-0 before:h-0 before:absolute before:top-[-8px] before:left-5",
          "before:border-l-8 before:border-r-8 before:border-b-8",
          "before:border-l-transparent before:border-r-transparent before:border-b-gray-50",
          isOverlayOpen && "flex animate-[dropdownFadeIn_0.3s_ease]"
        )}>
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
              <Link
                key={category.category_id}
                href={`/products?category=${encodeURIComponent(category.category_name)}`}
                className="w-full px-4 py-2 flex items-center justify-between transition-all duration-200 border-b border-white/10 last:border-b-0 hover:bg-linear-to-r hover:from-gray-200 hover:to-gray-300 group relative"
              >
                <div className="w-full flex items-center justify-between cursor-pointer">
                  <div className="font-medium transition-all duration-200 group-hover:translate-x-1">
                    {category.category_name}
                  </div>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <ChevronRight 
                      size={12} 
                      className="transition-all duration-200 group-hover:translate-x-0.5" 
                    />
                  )}
                </div>

                {/* Subcategorías */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="min-w-[250px] h-full py-1 hidden flex-col gap-0 absolute left-full top-0 z-5 bg-white border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-base group-hover:flex">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/products?category=${encodeURIComponent(category.category_name)}&subcategory=${encodeURIComponent(subcategory.name)}`}
                        className="w-full px-[18px] py-2.5 text-gray-800 font-medium no-underline border-b border-[#f3e7a6] last:border-b-0 transition-all duration-100 hover:bg-linear-to-r hover:from-[#f7b42c] hover:to-primary hover:text-white"
                      >
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                          {subcategory.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </Link>
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
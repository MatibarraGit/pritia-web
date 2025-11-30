"use client";

import { useMemo } from "react";
import Link from "next/link";

import { FilterIcon } from "lucide-react";

import { ListProducts } from "./ListProducts";
import { NavigationMenu } from "@/layout/NavigationMenu";
import { FiltersComponent, OrderComponent } from "@/components";
import { useFiltersContext, useOrderContext } from "@/hooks";
import { PRODUCTS_PER_PAGE } from "@/utils";
import { ProductType } from "@/types";

interface ShowProductsProps {
  products: ProductType[];
  totalProducts?: number | null;
  search?: string;
  breadcumbs?: boolean;
  subcategory?: string;
}

export const ShowProducts = ({
  products,
  totalProducts = null,
  search = "",
  breadcumbs = false,
  subcategory = "",
}: ShowProductsProps) => {
  const totalPages = Math.ceil((totalProducts || products.length) / PRODUCTS_PER_PAGE);

  // Filtros y ordenamiento
  const { filterProducts } = useFiltersContext();
  const { orderProducts } = useOrderContext();

  const { processedProducts, results } = useMemo(() => {
    const filteredProducts = filterProducts(products);
    const orderedProducts = orderProducts(filteredProducts);
    const finalProducts = orderedProducts || filteredProducts;
    const resultsText = finalProducts.length > 1 ? `${finalProducts.length} Resultados` : "1 Resultado";

    return {
      processedProducts: finalProducts,
      results: resultsText
    };
  }, [filterProducts, products, orderProducts]);

  return (
    <>
      <NavigationMenu />
      {/* Tools Buttons */}
      <div className="w-full max-w-content h-fit mt-[92.5px] mb-5 mx-auto relative">
        <div className="flex flex-col md:w-full md:flex-row-reverse md:items-start md:justify-start">
          <div className="flex items-center justify-between gap-4 bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] md:w-[calc(100%-270px)] md:bg-transparent md:shadow-none">
            <div className="flex items-center gap-4 flex-1">
              <OrderComponent />
              <span className="w-fit h-full flex items-center text-sm md:text-base md:whitespace-nowrap">
                {results}
              </span>
            </div>

            <label
              htmlFor="open-filters-menu"
              className="center-flex gap-[10px] cursor-pointer p-2 md:hidden"
            >
              <FilterIcon size={20} />
              Filtrar
            </label>
          </div>

          <div className="w-[96%] mt-5 mx-auto self-center md:w-[270px] md:pr-[30px] md:m-0">
            {breadcumbs ? (
              <div className="h-fit text-wrap">
                <Link href="/products" className="w-fit inline text-wrap text-base md:text-[15px] pr-[10px] underline md:no-underline hover:underline">Todos los productos</Link>
                {!!subcategory ? (
                  <>
                    <div className="w-fit inline text-wrap text-base md:text-[15px] pr-[10px]">/</div>
                    <Link href={`/products?category=${search}`} className="w-fit inline text-wrap text-base md:text-[15px] pr-[10px] underline md:no-underline hover:underline">{search}</Link>
                    <div className="w-fit inline text-wrap text-base md:text-[15px] pr-[10px]">/</div>
                    <h2 className="relative top-0 capitalize w-fit inline text-wrap text-base md:text-[15px]">{subcategory}</h2>
                  </>
                ) : (
                  <>
                    <div className="w-fit inline text-wrap text-base md:text-[15px] pr-[10px]">/</div>
                    <h2 className="relative top-0 capitalize w-fit inline text-wrap text-base md:text-[15px]">{search}</h2>
                  </>
                )}
              </div>
            ) : (
              <h2 className="relative top-0 capitalize w-fit inline text-wrap text-xl">{decodeURIComponent(search)}</h2>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="w-[96%] max-w-content h-full min-h-[calc(100vh-92.5px)] mx-auto flex flex-col relative md:min-h-[calc(100vh-70px)] md:flex-row">
        <input
          type="checkbox"
          id="open-filters-menu"
          className="hidden peer"
        />
        {/* TODO: Usar un solo componente para los filtros. Y que se muestre distinto en el mobile que en el desktop */}
        <div className="hidden md:block">
          <FiltersComponent />
        </div>
        <div className="md:hidden peer-checked:block hidden fixed inset-0 bg-black/50 z-40">
          <label
            htmlFor="open-filters-menu"
            className="absolute inset-0"
            aria-label="Cerrar filtros"
          />
          <div
            className="absolute right-0 top-0 h-full w-[80%] max-w-75 bg-white p-4 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <FiltersComponent />
          </div>
        </div>
        <ListProducts 
          products={processedProducts} 
          totalPages={totalPages}
        />
      </main>
    </>
  );
};


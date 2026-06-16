"use client";

import { useMemo } from "react";
import Link from "next/link";

import { FilterIcon } from "lucide-react";

import { ListProducts } from "./ListProducts";
import { FiltersComponent, OrderComponent } from "@/components";
import { useFiltersContext, useOrderContext } from "@/hooks";
import { PRODUCTS_PER_PAGE, toSlug } from "@/utils";
import { ProductType } from "@/types";

interface ShowProductsProps {
  products: ProductType[];
  totalProducts?: number | null;
  search?: string;
  category?: string;
  subcategory?: string;
}

export const ShowProducts = ({
  products,
  totalProducts = null,
  search = "",
  category = "",
  subcategory = "",
}: ShowProductsProps) => {
  const totalPages = Math.ceil(totalProducts ? totalProducts / PRODUCTS_PER_PAGE : (products.length) / PRODUCTS_PER_PAGE);

  // Filtros y ordenamiento
  const { filterProducts } = useFiltersContext();
  const { orderProducts } = useOrderContext();

  const { processedProducts } = useMemo(() => {
    const filteredProducts = filterProducts(products);
    const orderedProducts = orderProducts(filteredProducts);
    const finalProducts = orderedProducts || filteredProducts;

    return { processedProducts: finalProducts };
  }, [filterProducts, products, orderProducts]);

  return (
    <>
      {/* Encabezado */}
      <div className="w-full max-w-content md:w-11/12 h-fit mb-5 mx-auto relative md:mt-8">
      {/* <div className="w-full max-w-content md:w-11/12 h-fit mb-5 mx-auto relative md:mt-36"> */}
        <div className="grid gap-4 md:w-full md:grid-cols-[230px_1fr] md:items-start">

          {/* Breadcrumbs */}
          <div className="order-2 w-full md:order-1 px-[5%] md:px-0">
            {/* Si hay categoría, muestra breadcrumbs */}
            {category ? (
              <div className="h-fit text-wrap">
                <Link href="/productos" className="w-fit pr-2.5 inline font-subheading text-[15px] text-wrap underline md:ml-0 md:no-underline hover:underline">Todos los productos</Link>
                {/* Si hay subcategoría, muestra categoría y subcategoría */}
                {!!subcategory ? (
                  <>
                    <div className="w-fit pr-2.5 inline text-wrap text-[15px]">/</div>
                    <Link href={`/productos/${toSlug(category)}`} className="w-fit pr-2.5 inline text-wrap text-[15px] underline md:no-underline hover:underline">{category}</Link>
                    <div className="w-fit pr-2.5 inline text-wrap text-[15px]">/</div>
                    <h2 className="w-fit inline relative top-0 capitalize font-subheading text-wrap text-[15px]">{subcategory}</h2>
                  </>
                ) : (
                  // Si no hay subcategoría, muestra solo la categoría
                  <>
                    <div className="w-fit pr-2.5 inline text-wrap text-[15px]">/</div>
                    <h2 className="w-fit inline relative top-0 capitalize font-subheading text-wrap text-[15px]">{category}</h2>
                  </>
                )}
              </div>
            ) : (
              <h2 className="w-fit ml-[4%] inline relative top-0 capitalize font-subheading text-wrap text-xl md:ml-0">{decodeURIComponent(search)}</h2>
            )}
          </div>

          {/* Herramientas */}
          <div className="order-1 w-full bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] md:order-2 md:bg-transparent md:shadow-none">
            <div className="w-11/12 mx-auto flex items-center justify-between gap-4 text-sm sm:text-base md:w-full md:flex-row-reverse">
              <OrderComponent />

              <span className="w-fit h-full flex items-center md:text-base md:whitespace-nowrap">
                {totalProducts && totalProducts > 1 ? `${totalProducts} Resultados` : "1 Resultado"}
              </span>

              <label
                htmlFor="open-filters-menu"
                className="flex items-center gap-2 cursor-pointer p-2 md:hidden"
              >
                <FilterIcon size={14} />
                Filtrar
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="w-11/12 max-w-content h-full min-h-content mx-auto grid grid-rows-[auto_1fr] gap-6 relative md:grid-cols-[220px_1fr] md:grid-rows-1">
        <input
          type="checkbox"
          id="open-filters-menu"
          className="hidden peer"
        />

        {/* Filtros desktop */}
        <div className="hidden md:block">
          <FiltersComponent />
        </div>

        {/* Filtros mobile (offcanvas) */}
        <div className="md:hidden peer-checked:block hidden fixed inset-0 bg-black/50 z-40">
          <label
            htmlFor="open-filters-menu"
            className="absolute inset-0"
            aria-label="Cerrar filtros"
          />
          <div
            className="absolute right-0 top-0 h-full w-4/5 max-w-md bg-white p-4 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <FiltersComponent />
          </div>
        </div>

        {/* Resultados */}
        <div className="md:col-start-2">
          <ListProducts
            products={processedProducts}
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  );
};


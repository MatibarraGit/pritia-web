"use client";
import Image from "next/image";

import { ProductsCarousel } from "@/components";
import { ProductType } from "@/types";
import { Button } from "@/components/ui";

interface NoSearchResultsProps {
  search: string;
  products: ProductType[];
}

export const NoSearchResults = ({ search, products }: NoSearchResultsProps) => {
  return (
    <main className="w-full mx-auto flex flex-col relative bg-white items-center min-h-[calc(100vh-92.5px)] md:min-h-[calc(100vh-70px)]">
      <Image
        src={'/img/no-results.png'}
        alt="No se encontraron resultados"
        width={250}
        height={250}
      />

      <p className="w-[90%] max-w-[420px] mx-auto text-center text-lg">
        No se encontraron productos relacionados con{" "}
        <strong>{decodeURIComponent(search)}</strong>, intentá con otro término de búsqueda o
      </p>

      <Button variant="primary" href='/' className="w-[clamp(150px,50%,300px)] my-6 mx-auto text-center">
        Volver al Inicio
      </Button>

      <div className="w-[96%] max-w-[1200px] mx-auto">
        <h3 className="text-center">También podría interesarte</h3>

        <div className="my-[15px] mx-auto">
          {products && products.length > 0 && (
            <ProductsCarousel products={products} />
          )}
        </div>
      </div>
    </main>
  );
};


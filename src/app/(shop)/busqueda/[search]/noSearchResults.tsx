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
    <main className="w-full mx-auto flex flex-col relative bg-white items-center min-h-content">
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

      <div className="w-10/12 max-w-72 my-6 flex flex-col gap-3">
        <Button 
          className="w-full flex items-center gap-2.5 bg-green-600 border-green-600 text-white hover:bg-green-600/90"
          href={`https://wa.me/+5491131738925`}
          variant="outline"
        >
          <div className="flex items-center justify-center shrink-0">
            <Image src="/icons/whatsapp-white.svg" alt="WhatsApp" width={24} height={24} />
          </div>
          Consultar por WhatsApp 
        </Button>

        <Button variant="outline" href='/' className="w-full mx-auto text-center">
          Volver al Inicio
        </Button>
      </div>

      <div className="w-11/12 max-w-content mx-auto">
        <h3 className="text-center">También podría interesarte</h3>

        <div className="my-[15px] mx-auto">
          {products && products.length > 0 && (
            <ProductsCarousel products={products} loop={false} />
          )}
        </div>
      </div>
    </main>
  );
};


"use client";

import { Button } from "@/components/ui";
import { ProductCard } from "@/components";
import { ProductType } from "@/types";
import { useFetchData } from "@/hooks";

const fetchDailyHighlights = async (): Promise<ProductType[] | null> => {
  const response = await fetch("/api/products/home");
  const data = await response.json();
  // Usamos productsOnOffer (ofertas) para los destacados del día
  return data.productsOnOffer?.slice(0, 3) || [];
};

export const DailyHighlights = () => {
  const { data: products, isLoading: loading } = useFetchData<ProductType[]>({ 
    fetchFunction: fetchDailyHighlights 
  });

  return (
    <section className="w-11/12 max-w-content mx-auto py-8 md:py-12">
      <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #146B27 0%, #B80808 100%)",
          }}
        >
          <div className="p-8 flex flex-col h-full justify-between">
            <div>
              <h2 className="text-4xl font-subheading text-white mb-2">
                Destacados Del Día
              </h2>
              <p className="text-white/90 mb-6">
                Ofertas especiales por tiempo limitado
              </p>
            </div>
            <Button className="bg-black hover:bg-black/80 text-white w-fit">
              CONOCELOS
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="col-span-3 flex items-center justify-center">
            <p className="text-gray-500">Cargando productos...</p>
          </div>
        ) : (
          (products || []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
};
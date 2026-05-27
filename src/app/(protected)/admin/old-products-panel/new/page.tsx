"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { productDataContext } from "@/contexts";
import { AdminReturnButton, MyLoader, PageLoader, ProductForm, ProductPreview } from "@/components";

function NewProductPageContent({ id }: { id?: number }) {
  const { productData, isProductLoading, loadProductById, resetProductData } = productDataContext();
  
  useEffect(() => {
    resetProductData();
    if (id) {
      // Asegurar que el producto se cargue correctamente
      const loadProduct = async () => {
        try {
          await loadProductById(id);
        } finally {}
      };
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [searchParams]);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">
          {productData.slug ? 'Editar Producto' : 'Publicar Producto'}
        </h3>
        <AdminReturnButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {isProductLoading && <MyLoader className="absolute top-0 left-0 w-full h-screen center-flex bg-primary/5 z-10 rounded-lg" />}
        <ProductForm />
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <ProductPreview productData={productData} />
        </div>
      </div>
    </div>
  );
}

export default function NewProductPage({ id }: { id?: number }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <NewProductPageContent id={id} />
    </Suspense>
  );
}
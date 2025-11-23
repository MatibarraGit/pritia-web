"use client";

import { NavigationMenu } from "@/layout/NavigationMenu";
import { NoLovedProducts } from "./noLovedProducts";
// TODO: Importar LovedProductList y MultipleSelectionMenu cuando estén disponibles
// import { LovedProductList, MultipleSelectionMenu } from "@/components";

export default function LovedProductsPage() {
  // TODO: Implementar lógica de productos favoritos cuando esté disponible el contexto
  const lovedProducts: any[] = []; // Placeholder
  const hasLovedProducts = lovedProducts.length > 0;

  // TODO: Implementar cuando estén disponibles los contextos
  // const { lovedProducts, removeLovedProduct } = lovedProductsContext();
  // const { addToCart } = cartContext();
  // const { showToast } = toastContext();
  // const { deleteSelectedItems } = selectItemsContext();

  return (
    <>
      <NavigationMenu />
      <main className="min-h-[calc(100vh-92.5px)] bg-background relative">
        <div className="w-full pb-10 relative top-0 bg-primary">
          <h1 className="p-6 text-2xl text-center text-white">Productos Favoritos</h1>
        </div>

        {hasLovedProducts ? (
          <>
            {/* TODO: Agregar MultipleSelectionMenu cuando esté disponible */}
            {/* <MultipleSelectionMenu handleDelete={handleDelete} /> */}
            {/* TODO: Agregar LovedProductList cuando esté disponible */}
            {/* <LovedProductList handleAddToCart={handleAddToCart} handleAddAllToCart={handleAddAllToCart} /> */}
            <div className="w-11/12 max-w-[1200px] mx-auto py-8">
              <p className="text-center text-gray-500">
                Los componentes de productos favoritos se implementarán próximamente.
              </p>
            </div>
          </>
        ) : (
          <NoLovedProducts />
        )}
      </main>
    </>
  );
}


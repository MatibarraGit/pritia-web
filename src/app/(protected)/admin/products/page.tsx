"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { AdminDisplayData, Pagination, PageLoader, ProductModal } from "@/components";
import { useFetchData } from "@/hooks";
import { getAllProducts, fetchAllCategories, fetchAllProviders, deleteProduct, disableProduct } from "@/services";
import { ACTION_TYPES, PRODUCTS_PER_PAGE, confirmAction } from "@/utils";

import type { SortConfig } from "@/hooks";
import type { GetAllProductsResponse } from "@/services";
import type { ProductType } from "@/types";

interface ProductToAction {
  id: number | null;
  name: string;
  slug: string;
}

function AdminProducts() {
  const params = useSearchParams();
  const page = params.get("page") ? parseInt(params.get("page")!) : 1;
  const search = params.get("search") || "";

  const {
    data,
    setData,
    isLoading,
    fetchData,
  } = useFetchData<GetAllProductsResponse, { page: number; search: string }>({ 
    fetchFunction: (args) => getAllProducts(args || { page: 1, search: "" }) 
  });

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Cuando vuelvo después de editar un producto, mantiene la página y la búsqueda en la url y los resultados coinciden con la url
  useEffect(() => {
    fetchData({ page, search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const {
    data: filterConfig,
    isLoading: isLoadingFilterConfig,
  } = useFetchData<Record<string, { enabled: boolean; options: Array<{ value: string | boolean; label: string }> }>>({ 
    fetchFunction: getFilterConfig 
  });
  
  const columns = ['Imagen', 'Nombre', 'Proveedor', 'P/Compra', 'P/Venta', 'P/Revendedores', 'Descuento', 'Categoría', 'Subcategoría', 'Stock', 'Creación', 'Ver/Editar', 'Desactivar', 'Eliminar'];
  const map = ['images', 'name', 'provider', 'purchasePrice', 'originalPrice', 'resellersPrice', 'discountPercent', 'category', 'subcategory', 'inStock', 'createdAt'];
  
  const [opened, setOpened] = useState(false);
  const [actionType, setActionType] = useState<string>(ACTION_TYPES.DELETE);
  const [productToAction, setProductToAction] = useState<ProductToAction>({
    id: null,
    name: "",
    slug: ""
  });

  const handleAction = (action: string, item: ProductType | null = null) => {
    if (item) {
      setProductToAction({ id: item.id, name: item.name, slug: item.slug });
      setActionType(action);
      setOpened(true);
    }
  };

  async function handleConfirmProductAction() {
    if (!productToAction.id) return;
    const productAction = actionType === ACTION_TYPES.DISABLE ? disableProduct : deleteProduct;
    
    const result = await confirmAction({ 
      actionType: actionType,
      productToAction: productToAction, 
      handleProductAction: productAction, 
      args: productToAction.id,
      close: () => setOpened(false)
    });

    if(result.errorMessage) return;
    
    if (data) {
      setData({ 
        products: products.filter((product) => product.id !== productToAction.id), 
        total: totalProducts - 1 
      });
    }
  }

  const sortConfig: SortConfig = { 
    "name": { enabled: true, type: "string" },
    "price": { enabled: true, type: "number" },
    "discountPercent": { enabled: true, type: "number" },
    "createdAt": { enabled: true, type: "date", default: true },
  };

  return (
    <> 
      <AdminDisplayData 
        pageConfig={{
          pageTitle: 'Productos',
          pageDescription: 'Gestioná tu catálogo de productos',
          isLoading: isLoading || isLoadingFilterConfig,
          span: 'Añadir Producto',
        }}
        toolbarConfig={{
          href: '/admin/products/new',
          onClick: undefined,
          serverSearch: true,
        }}
        tableData={{
          items: products,
          columns: columns,
          map: map,
          withEditButton: false,
          editLink: '/admin/products/edit',
          withDisableButton: true,
          sortConfig: sortConfig,
          filterConfig: filterConfig || {}
        }}
        modalConfig={{
          modalTitle: actionType === ACTION_TYPES.DISABLE 
            ? `¿Desea desactivar el producto ${productToAction.name}?`
            : `¿Seguro que desea eliminar el producto ${productToAction.name}?`, 
          modalContent: (
            <ProductModal 
              type={actionType} 
              handleConfirmProductAction={handleConfirmProductAction}
              close={() => setOpened(false)} 
            />
          ),
          opened: opened,
          close: () => setOpened(false)
        }}
        handleAction={handleAction}
      />
    
      <Pagination totalPages={totalPages} className="my-5" />
      <h4 className="text-center">
        {isLoading !== true && totalProducts} Productos
      </h4>
    </>
  );
}

// Configuración para filtros
async function getFilterConfig() {
  const providers = await fetchAllProviders();
  const categories = await fetchAllCategories();
  
  return {
    "provider": {
      enabled: true,
      options: (providers || []).map(provider => ({ value: provider.provider_name, label: provider.provider_name }))
    },
    "category": {
      enabled: true,
      options: (categories || []).map(category => ({ value: category.category_name, label: category.category_name }))
    },
    "inStock": {
      enabled: true,
      options: [
        { value: true, label: "Disponible" },
        { value: false, label: "Agotado" },
      ]
    }
  };
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminProducts />
    </Suspense>
  );
}


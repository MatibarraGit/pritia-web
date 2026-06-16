"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Boxes, History, List, type LucideIcon } from "lucide-react";

import { CustomTable, PageLoader, Pagination } from "@/components";
import { Button } from "@/components/ui";
import { useFetchData, useFiltersContext } from "@/hooks";
import { getAllProducts, getInventoryProducts, getOutdatedProducts } from "@/services";
import { PRODUCTS_PER_PAGE } from "@/utils";
import type { GetAllProductsParams, GetAllProductsResponse } from "@/services";

const PRODUCT_ADMIN_VIEWS = ["all", "inventory", "outdated"] as const;
type ProductAdminView = typeof PRODUCT_ADMIN_VIEWS[number];

type ProductAdminViewOption = {
  id: ProductAdminView;
  label: string;
  href: string;
  icon: LucideIcon;
};

const PRODUCT_ADMIN_VIEW_OPTIONS: ProductAdminViewOption[] = [
  {
    id: "all",
    label: "Todos",
    href: "/admin/products?page=1",
    icon: List,
  },
  {
    id: "inventory",
    label: "Inventario",
    href: "/admin/products?view=inventory&page=1",
    icon: Boxes,
  },
  {
    id: "outdated",
    label: "Productos desactualizados",
    href: "/admin/products?view=outdated&page=1",
    icon: History,
  },
];

const PRODUCT_ADMIN_FETCHERS: Record<
  ProductAdminView,
  (args?: GetAllProductsParams) => Promise<GetAllProductsResponse>
> = {
  all: getAllProducts,
  inventory: getInventoryProducts,
  outdated: getOutdatedProducts,
};

function getProductAdminView(view: string | null): ProductAdminView {
  return PRODUCT_ADMIN_VIEWS.includes(view as ProductAdminView) ? (view as ProductAdminView) : "all";
}

function ProductsPageComponent() {
  const params = useSearchParams();
  const router = useRouter();
  const { clearFilter } = useFiltersContext();
  const page = params.get("page") ? parseInt(params.get("page")!) : 1;
  const search = params.get("search") || "";
  const currentView = getProductAdminView(params.get("view"));

  const fetchProducts = useCallback(
    (args?: GetAllProductsParams) => {
      const fetchParams = args || { page: 1, search: "" };
      return PRODUCT_ADMIN_FETCHERS[currentView](fetchParams);
    },
    [currentView]
  );

  const handleViewChange = useCallback(
    (href: string) => {
      clearFilter("productsClientSearch");
      router.push(href);
    },
    [clearFilter, router]
  );

  const {
    data,
    isLoading,
    fetchData,
  } = useFetchData<GetAllProductsResponse, GetAllProductsParams>({
    fetchFunction: fetchProducts,
    initialFetch: false,
  });

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    fetchData({ page, search });
  }, [fetchData, currentView, page, search]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-3xl font-bold text-gray-900">Productos</h3>
        <p className="text-sm text-gray-500">Gestiona tu catalogo de productos</p>
      </div>

      <nav className="mb-6 rounded-xl border border-gray-200 bg-white p-3 shadow-sm" aria-label="Vistas de productos">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-subheading text-gray-700">Vistas rápidas</span>
          <ul className="flex flex-wrap gap-2">
            {PRODUCT_ADMIN_VIEW_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = currentView === option.id;

              return (
                <li key={option.id}>
                  <Button
                    type="button"
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => handleViewChange(option.href)}
                  >
                    <Icon size={16} />
                    {option.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <CustomTable products={products} isLoading={isLoading} />

      <Pagination totalPages={totalPages} className="my-5" />
      <h4 className="text-center">
        {isLoading !== true && totalProducts} Productos
      </h4>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductsPageComponent />
    </Suspense>
  );
}

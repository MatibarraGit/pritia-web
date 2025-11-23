import { normalizeText } from "@/utils";
import { filtersContext, Filters, AdminFilters } from "@/contexts/filters-context";
import { ProductType } from "@/types";

export const useFiltersContext = () => {
  const {
    filters,
    setPriceRange,
    setVisualPriceRange,
    handleFilterChange,
    resetFilters,
    adminFilters,
    handleAdminFilterChange,
    clearFilter,
    clearAllFilters
  } = filtersContext();

  const filterProducts = (products: ProductType[]): ProductType[] => {
    if (!products || products.length === 0) return [];

    const filteredProducts = [...products];

    return filteredProducts.filter((product) => (
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max &&
      (filters.category.length === 0 || filters.category.includes(product.category)) &&
      (filters.subcategory.length === 0 || filters.subcategory.includes(product.subcategory))
    ));
  };

  const filterItems = <T extends { name?: string; id?: string | number; [key: string]: unknown }>(
    items: T[] | { products: T[] }
  ): T[] => {
    if (!items) return [];
    
    let filteredItems: T[];
    
    if (Array.isArray(items)) {
      filteredItems = [...items];
    } else if ('products' in items && Array.isArray(items.products)) {
      filteredItems = [...items.products];
    } else {
      return [];
    }

    if (filteredItems.length === 0) return [];

    // Aplicar filtros
    Object.entries(adminFilters).forEach(([columnKey, selectedValues]) => {
      if (columnKey && typeof selectedValues === "string" && selectedValues.length > 0) {
        filteredItems = filteredItems.filter(item => {
          const itemName = item.name ? normalizeText(item.name) : '';
          const itemId = item.id ? normalizeText(String(item.id)) : '';
          const searchTerm = normalizeText(selectedValues);
          // Verificamos si el término de búsqueda (si existe) está incluido en el nombre
          const matchesSearch = itemName?.includes(searchTerm) || itemId?.includes(searchTerm);
          return matchesSearch;
        });
      } else if (selectedValues && Array.isArray(selectedValues) && selectedValues.length > 0) {
        filteredItems = filteredItems.filter(item => (
          selectedValues.includes(item[columnKey] as string)
        ));
      }
    });

    return filteredItems;
  };

  return {
    filterProducts,
    filterItems,
    filters,
    setPriceRange,
    setVisualPriceRange,
    handleFilterChange,
    resetFilters,
    adminFilters,
    handleAdminFilterChange,
    clearFilter,
    clearAllFilters
  };
};


import { create } from 'zustand';

export interface PriceRange {
  min: number;
  max: number;
}

export interface Filters {
  category: string[];
  subcategory: string[];
  priceRange: PriceRange;
  visualPriceRange: PriceRange;
}

export interface AdminFilters {
  [columnKey: string]: string | string[];
}

interface FiltersState {
  filters: Filters;
  setPriceRange: (min: number, max: number) => void;
  setVisualPriceRange: (min: number, max: number) => void;
  handleFilterChange: (filterType: 'category' | 'subcategory', value: string) => void;
  resetFilters: () => void;
  adminFilters: AdminFilters;
  handleAdminFilterChange: (columnKey: string, value: string | string[]) => void;
  clearFilter: (columnKey: string) => void;
  clearAllFilters: () => void;
}

export const filtersContext = create<FiltersState>((set) => ({
  // Estados
  filters: {
    category: [],
    subcategory: [],
    priceRange: { min: 0, max: 1200000 },
    visualPriceRange: { min: 0, max: 1200000 },
  },

  setPriceRange: (min: number, max: number) => set((state) => ({
    filters: {
      ...state.filters,
      priceRange: { min: Number(min), max: Number(max) },
    }
  })),

  setVisualPriceRange: (min: number, max: number) => set((state) => ({
    filters: {
      ...state.filters,
      visualPriceRange: { min: Number(min), max: Number(max) },
    }
  })),

  handleFilterChange: (filterType: 'category' | 'subcategory', value: string) => set((state) => ({
    filters: {
      ...state.filters,
      [filterType]: state.filters[filterType].includes(value)
        ? state.filters[filterType].filter((v) => v !== value)
        : [...state.filters[filterType], value],
    }
  })),

  // Función para resetear los filtros  
  resetFilters: () => set((state) => {
    const defaultFilters: Filters = {
      category: [],
      subcategory: [],
      priceRange: { min: 0, max: 1200000 },
      visualPriceRange: { min: 0, max: 1200000 },
    };
    // Comprueba si los filtros actuales son diferentes de los filtros por defecto
    if (JSON.stringify(state.filters) !== JSON.stringify(defaultFilters)) {
      return { filters: defaultFilters };
    }
    return state;
  }),

  // ---- Sección de admins ----
  adminFilters: {},

  handleAdminFilterChange: (columnKey: string, value: string | string[]) => set((state) => ({
    adminFilters: {
      ...state.adminFilters,
      [columnKey]: value
    }
  })),

  // Limpiar filtro específico
  clearFilter: (columnKey: string) => set((state) => {
    const newFilters = { ...state.adminFilters };
    delete newFilters[columnKey];
    return { adminFilters: newFilters }
  }),

  // Limpiar todos los filtros
  clearAllFilters: () => set(() => ({ adminFilters: {} })),
}));


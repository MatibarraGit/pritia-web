"use client";

import { useFiltersContext } from "@/hooks";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { CategoriesAccordion } from "@/components/layout/header/CategoriesAccordion";

export const FiltersComponent = () => {
  const { filters, setPriceRange, setVisualPriceRange, resetFilters } = useFiltersContext();

  return (
    <aside className="w-full md:w-[250px] md:pr-[30px] md:sticky md:top-[92.5px] md:h-fit">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-lg font-semibold">Filtrar por:</h2>
        <button 
          onClick={resetFilters} 
          className="w-fit px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      {/* CATEGORÍA - Accordion */}
      <section className="mb-6">
        <CategoriesAccordion closeMenuOnClick={false} />
      </section>

      {/* PRECIO */}
      <section>
        <h3 className="text-base font-medium mb-4">Precio</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={1200000}
            step={10000}
            value={[filters.visualPriceRange.min, filters.visualPriceRange.max]}
            onValueChange={(values) => {
              setVisualPriceRange(values[0], values[1]);
            }}
            onValueCommit={(values) => {
              setPriceRange(values[0], values[1]);
            }}
            className="w-full"
          />

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Desde</span>
            <span>Hasta</span>
          </div>

          <div className="flex gap-2">
            {/* TODO: Hacer un separador de miles para el input */}
            <div className="flex-1">
              <Input
                type="number"
                min={0}
                max={1200000}
                step={5000}
                value={filters.visualPriceRange.min}
                onChange={(e) => {
                  const value = Math.max(0, Math.min(1200000, Number(e.target.value) || 0));
                  setVisualPriceRange(value, filters.visualPriceRange.max);
                  setPriceRange(value, filters.priceRange.max);
                }}
                className="w-full"
                placeholder="Mínimo"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                min={0}
                max={1200000}
                step={5000}
                value={filters.visualPriceRange.max}
                onChange={(e) => {
                  const value = Math.max(0, Math.min(1200000, Number(e.target.value) || 0));
                  setVisualPriceRange(filters.visualPriceRange.min, value);
                  setPriceRange(filters.priceRange.min, value);
                }}
                className="w-full"
                placeholder="Máximo"
              />
            </div>
          </div>

        </div>
      </section>
    </aside>
  );
};


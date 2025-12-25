"use client";

import { X } from "lucide-react";
import { Suspense } from "react";
import { Button, Input, Slider } from "@/components/ui";
import { useFiltersContext } from "@/hooks";
import { CategoriesAccordion } from "@/layout/header/CategoriesAccordion";

export const FiltersComponent = () => {
  const { filters, setPriceRange, setVisualPriceRange, resetFilters } = useFiltersContext();

  return (
    <aside 
      className="w-full bg-white md:w-56 md:h-fit md:px-4 md:py-4 md:sticky md:top-36 md:shadow-md md:rounded-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg text-gray-500">Filtros</span>

        <label
          htmlFor="open-filters-menu"
          className="p-2 flex items-center gap-2 cursor-pointer rounded-md md:hidden hover:bg-accent/50"
        > 
          <X size={18}/>
        </label>
      </div>

      {/* CATEGORÍA - Accordion */}
      <section className="md:px-1 mb-6 overflow-hidden">
        <Suspense fallback={
          <div className="w-full p-4 text-center text-sm text-gray-500">
            Cargando categorías...
          </div>
        }>
          <CategoriesAccordion closeMenuOnClick={false} />
        </Suspense>
      </section>

      {/* PRECIO */}
      <section className="md:px-1">
        <span className="text-base text-black font-semibold">Precio</span> 
        <div className="mt-2 space-y-4">
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
            className="w-full py-2"
          />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Desde</span>
            <span>Hasta</span>
          </div>

          <div className="flex gap-3">
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
                className="w-full h-10 border-border focus:border-primary focus:ring-primary"
                placeholder="0"
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
                className="w-full h-10 border-border focus:border-primary focus:ring-primary"
                placeholder="1200000"
              />
            </div>
          </div>
        </div>

        <Button 
          variant="secondary"
          className="mt-4 text-center"
          onClick={resetFilters}
        >
          Limpiar Filtros
        </Button>
      </section>
    </aside>
  );
};
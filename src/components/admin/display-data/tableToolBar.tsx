"use client";

import { useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { MagnifyingGlass } from "@/components";
import { useFiltersContext } from "@/hooks";
import { ACTION_TYPES, getFilterName } from "@/utils";

interface TableToolBarProps {
  pageTitle: string;
  href?: string;
  onClick?: (action: string) => void;
  span?: string;
  serverSearch?: boolean;
}

export const TableToolBar = ({ pageTitle, href, onClick, span, serverSearch }: TableToolBarProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  
  const { adminFilters, handleAdminFilterChange, clearFilter } = useFiltersContext();
  const activesFilters = Object.entries(adminFilters);
  const search = params.get('search') ?? (adminFilters.name as string | undefined);

  // Limpiar filtros vacíos cuando cambian los adminFilters
  useEffect(() => {
    const hasEmptyValues = activesFilters.find(([key, value]) => {
      if (Array.isArray(value) && value.length === 0) {
        return key;
      }
      return undefined;
    });

    if (hasEmptyValues) {
      clearFilter(hasEmptyValues[0]);
    }
  }, [activesFilters, clearFilter]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = formData.get('search') as string;

    if (serverSearch) {
      // Actualizar los parámetros de la URL
      params.set('page', '1');
      if (searchValue) {
        params.set('search', searchValue);
      } else {
        params.delete('search');
      }
      
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      handleAdminFilterChange("name", searchValue);
    }
  }

  return (
    <>
      <div className="w-full pb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form ref={formRef} onSubmit={handleSearch} className="w-full md:w-auto md:flex-1 md:max-w-md">
          <div className="relative w-full group">
            <Input
              type="text"
              placeholder={`Buscar ${pageTitle}...`}
              name="search"
              defaultValue={search}
              className="pr-12 w-full border-gray-300 focus:ring-2 focus:ring-primary transition-all duration-200"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95 center-flex"
              aria-label="Buscar"
            >
              <MagnifyingGlass
                className="bg-transparent border-none"
                type="submit"
              />
            </div>
          </div>
        </form>

        <div className="w-full flex items-center justify-between flex-wrap gap-2 md:w-fit md:justify-start">
          {search && (
            <button
              className="px-3 py-1.5 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg outline-none hover:bg-green-100 hover:border-green-300 transition-all duration-200 active:scale-95 animate-in fade-in slide-in-from-right-4"
              onClick={() => {
                formRef.current?.reset();
                if (serverSearch) {
                  params.delete('search');
                  router.replace(`${pathname}?${params.toString()}`);
                } else {
                  handleAdminFilterChange("name", "");
                }
              }}
            >
              <span className="text-sm font-medium text-green-700">{search}</span>
              <X size={16} className="text-green-600" />
            </button>
          )}

          {href && (
            <Button 
              className={`flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ${span ? '' : 'md:px-3'}`} 
              href={href}
              variant="primary"
            >
              <Plus size={18} />
              {span && <span className="hidden md:inline text-nowrap font-medium">{span}</span>}
            </Button>
          )}

          {onClick && (
            <Button
              className={`flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ${span ? '' : 'md:px-3'}`}
              onClick={() => onClick(ACTION_TYPES.CREATE)}
              variant="primary"
            >
              <Plus size={18} />
              {span && <span className="hidden md:inline text-nowrap font-medium">{span}</span>}
            </Button>
          )}
        </div>
      </div>

      {adminFilters && activesFilters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
          {activesFilters.map(
            ([key, values]) =>
              key !== "name" && (
                <button
                  key={key}
                  onClick={() => clearFilter(key)}
                  className="px-3 py-1.5 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg outline-none hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 active:scale-95 group"
                >
                  <X size={16} className="text-blue-600 group-hover:text-blue-700 shrink-0" />
                  <span className="text-sm font-medium text-blue-700">{getFilterName(key)}:</span>
                  {Array.isArray(values) && values.map((v, i) => (
                    <span key={i} className={`text-sm text-blue-600 ${i > 0 ? "before:content-['_/_'] before:text-blue-400" : ""}`}>
                      {key === "inStock" ? (v ? "Disponible" : "Agotado") : String(v)}
                    </span>
                  ))}
                </button>
              )
          )}
        </div>
      )}
    </>
  );
};




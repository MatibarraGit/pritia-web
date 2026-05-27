/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Filter, Pencil } from "lucide-react";

import { selectItemsContext } from "@/contexts";
import { DeleteButton, TableLoader } from "@/components";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { useFiltersContext, useOrderContext, type SortConfig } from "@/hooks";
import { cn } from "@/libs/utils";
import { ACTION_TYPES, formatDate, formatPrice, getOrderStatusColor } from "@/utils";

interface TableOfItemsProps<T> {
  isLoading: boolean;
  items: T[];
  columns: string[];
  map: string[];
  withEditButton?: boolean;
  editLink?: string | undefined;
  handleAction: (action: string, item: T) => void;
  withDeleteButton?: boolean;
  sortConfig?: SortConfig;
  filterConfig?: Record<string, { enabled: boolean; options: Array<{ value: string | boolean; label: string }> }>;
}

export function TableOfItems<T extends Record<string, unknown> & { id: number | string; name?: string }>({
  isLoading,
  items,
  columns,
  map,
  withEditButton = true,
  editLink,
  handleAction,
  withDeleteButton = true,
  sortConfig = {},
  filterConfig = {}
}: TableOfItemsProps<T>) {
  const { adminFilters, handleAdminFilterChange, clearAllFilters, filterItems } = useFiltersContext();
  const { sortObject, handleSort, orderItems } = useOrderContext();
  const { isSelecting, selectedIds, toggleItemSelection } = selectItemsContext(); 

  const handleClickItem = (item: T) => {
    if (!isSelecting) return;
    const images = (item.images as string[] | undefined) || [];
    // const image = images.length > 0 ? images[0] : '';
    const name = (item.name as string | undefined) || '';
    const description = (item.description as string | undefined) || '';
    const sellPrice = Number(item.price) || 0;
    const resellersPrice = Number(item.resellersPrice) || 0;
    
    toggleItemSelection({
      id: Number(item.id),
      name,
      images,
      description,
      sellPrice,
      resellersPrice,
      originalPrice: Number(item.originalPrice) || null,
    });
  }

  useEffect(() => {
    clearAllFilters();

    const sortConfigObject = Object.entries(sortConfig);
    if (sortConfig && sortConfigObject.length > 0) {
      for (const [key, value] of sortConfigObject) {
        if (value && typeof value === 'object' && 'default' in value && value.default) {
          handleSort(key, 'desc');
          break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Procesar y filtrar datos
  const processedItems = useMemo(() => {
    // Aplicar filtros
    const filteredItems = filterItems(items);
    // Aplicar ordenamiento
    const orderedItems = orderItems(filteredItems, sortConfig);

    return orderedItems || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, sortConfig, adminFilters, sortObject]);

  // Renderizar columnas de encabezados
  function renderColumnHeader(column: string, index: number) {
    const columnKey = map[index];
    const canSort = sortConfig[columnKey]?.enabled;
    const canFilter = filterConfig[columnKey]?.enabled;
    const isActive = sortObject?.property === columnKey;
    const activeFilters = (adminFilters[columnKey] as string[] | string) || [];
    const activeFiltersArray = Array.isArray(activeFilters) ? activeFilters : (activeFilters ? [activeFilters] : []);

    return (
      <div key={index} className="min-w-full w-max max-w-75 p-4 flex items-center justify-center text-center whitespace-normal wrap-break-words bg-gray-50 text-sm text-gray-700 font-semibold tracking-wide border-b border-gray-200">
        {/* Ordenamiento disponible */}
        {canSort && (
          <button 
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 font-semibold rounded-lg border-none bg-transparent outline-none hover:bg-gray-100 hover:text-primary transition-all duration-200 active:scale-95" 
            onClick={() => handleSort(columnKey)}
          >
            {column}
            <div className="flex flex-col gap-0">
              <ChevronUp 
                size={14} 
                className={cn(
                  "transition-colors duration-200",
                  isActive && sortObject.direction === "asc" ? "text-primary" : "text-gray-400"
                )} 
              /> 
              <ChevronDown 
                size={14} 
                className={cn(
                  "transition-colors duration-200",
                  isActive && sortObject.direction === "desc" ? "text-primary" : "text-gray-400"
                )} 
              /> 
            </div>
          </button>
        )}

        {/* Filtros disponibles */}
        {canFilter && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 font-semibold rounded-lg border-none bg-transparent outline-none hover:bg-gray-100 hover:text-primary transition-all duration-200 active:scale-95">
                {column}
                <Filter size={16} className={activeFiltersArray.length > 0 ? "text-primary" : "text-gray-400"} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 max-h-120 p-2 bg-white overflow-y-scroll">
              <div className="flex flex-col gap-1">
                {filterConfig[columnKey].options.map(option => (
                  <button
                    key={String(option.value)}
                    onClick={() => {
                      const newValue = activeFiltersArray.includes(String(option.value))
                        ? activeFiltersArray.filter(v => v !== String(option.value))
                        : [...activeFiltersArray, String(option.value)];
                      handleAdminFilterChange(columnKey, newValue);
                    }}
                    className={`text-left px-3 py-2 rounded-lg border-none outline-none transition-all duration-200 ${
                      activeFiltersArray.includes(String(option.value)) 
                        ? 'bg-primary text-white font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        {!canFilter && !canSort && (
          <span className="text-gray-700">{column}</span>
        )}
      </div>
    );
  }

  if (isLoading) {
    return <TableLoader />;
  }

  if (!items || items.length === 0) {
    return (
      <p className="w-full mt-5 flex flex-col justify-center items-center gap-1.5 text-center text-gray-500">
        No hay items para mostrar. Probá con otro término de búsqueda o agregá items nuevos
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
      <div
        className="h-full max-h-[60dvh] grid rounded-lg relative transition-all overflow-auto md:max-h-[70dvh]"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
      >
        {/* Header */}
        <div className="contents sticky top-0 z-10">
          {columns.map((column, index) => renderColumnHeader(column, index))}
        </div>

        {/* Filas de datos */}
        {processedItems.map((item, index) => (
          <div 
            key={String(item.id)} 
            className={cn(
              "contents group hover:bg-gray-50 transition-colors duration-200",
              isSelecting && "cursor-pointer"
            )
            }
            style={{ animationDelay: `${index * 20}ms` }}
            onClick={() => handleClickItem(item)}
          >
            {map.map((mapKey) => (
              <div 
                key={mapKey} 
                className={cn(
                  "min-w-full w-max max-w-75 p-4 flex items-center justify-center text-center whitespace-normal wrap-break-words border-b border-gray-100 transition-all overflow-hidden group-hover:bg-gray-50",
                  selectedIds.includes(Number(item.id)) && "bg-secondary/30 group-hover:bg-secondary/50"
                )}
              >
                {mapKey !== "" 
                  ? renderCellValue(item, mapKey)
                  : <span className="text-gray-600 font-medium">{index + 1}</span>
                }
              </div>
            ))}

            {/* Botón para editar */}
            {withEditButton && !editLink && (
              <div className="min-w-full w-max max-w-75 p-4 flex items-center justify-center text-center whitespace-normal wrap-break-words border-b border-gray-100 transition-all overflow-hidden group-hover:bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => handleAction(ACTION_TYPES.UPDATE, item)}
                >
                  <Pencil size={18} />
                </Button>
              </div>
            )}

            {!withEditButton && !!editLink && (
              <div className="group/button min-w-full w-max max-w-75 p-4 flex items-center justify-center text-center whitespace-normal wrap-break-words border-b border-gray-100 transition-all overflow-hidden group-hover:bg-gray-50">
                <Button
                  variant="outline"
                  href={`${editLink}/${item.id}`}
                >
                  <Pencil size={18} />
                </Button>
              </div>
            )}

            {withDeleteButton === true && (
              <div className="group/button min-w-full w-max max-w-75 p-4 flex items-center justify-center text-center whitespace-normal wrap-break-words border-b border-gray-100 transition-all overflow-hidden group-hover:bg-gray-50">
                <DeleteButton onClick={() => handleAction(ACTION_TYPES.DELETE, item)} />
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay resultados después de filtrar */}
      {processedItems.length === 0 && items.length > 0 && (
        <div className="w-full my-5 flex flex-col justify-center items-center gap-1.5">
          <p className="mb-4">No se encontraron resultados con los filtros aplicados.</p>
          <Button onClick={clearAllFilters} variant="outline">
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}

// Renderizar valor de celda
function renderCellValue(item: Record<string, unknown>, mapKey: string) {
  const value = item[mapKey];
  
  if (mapKey.toLowerCase().includes("price") || mapKey === "orderTotal") { 
    return formatPrice(Number(value) || 0);
  }

  if (mapKey.toLowerCase().includes("date") || mapKey === "createdAt" || mapKey === "updatedAt") {
    return formatDate(String(value || '')).fechaMostrar;
  }
  
  if (mapKey === "images") {
    const images = Array.isArray(value) ? value : [];

    return (
      <div className="w-full grid grid-cols-2 gap-1.5">
        {images?.map((image) => (
          <img
            key={image}
            src={image}
            alt={String(item?.name || '')}
            width={images.length === 1 ? 100 : 50}
            height={images.length === 1 ? 100 : 100 / images.length + 25}
            className={cn("object-contain cursor-pointer", images.length === 1 ? "col-span-2" : "col-span-1")} 
            onClick={() => window.open(image, '_blank')}
          />
        ))}
      </div>
    )
  }

  if (mapKey === "inStock") {
    if (!!value) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          Disponible
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          Agotado
        </span>
      );
    }
  }
  
  if (mapKey === "discountPercent") {
    const discountPercent = Number(value) || 0;
    if (!discountPercent || discountPercent === 0) return `${discountPercent}%`;
    else {
      const originalPrice = Number(item.originalPrice) || 0;
      const discountPrice = originalPrice * (discountPercent / 100);
      const priceWithDiscount = originalPrice - discountPrice;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 cursor-pointer transition-all font-medium hover:bg-blue-100 hover:border-blue-300">{`${discountPercent}%`}</span>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <div>
                <span>Descuento: </span>
                <span>{formatPrice(discountPrice)}</span>
              </div>
              <div>
                <span>Precio con descuento: </span>
                <span>{formatPrice(priceWithDiscount)}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
  }
  
  if (mapKey === "orderStatus") {
    return (
      <span 
        className="inline-block px-2 py-1 rounded-full text-sm text-white"
        style={{ 
          backgroundColor: getOrderStatusColor(String(value)),
        }}
      >
        {String(value)}
      </span>
    );
  }
  
  return String(value || '');
}
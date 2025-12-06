"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, X, ChevronDown } from "lucide-react";

import { useOrderContext } from "@/hooks";
import { ORDER_PARAMETERS } from "@/utils";

export function OrderComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const { sortObject, handleSort, resetOrderObject } = useOrderContext();
  const orderParameters = Object.entries(ORDER_PARAMETERS);

  // Encontrar el parámetro seleccionado basado en sortObject
  const selectedParameter = sortObject
    ? orderParameters.find(([_, value]) => value === sortObject.property) || null
    : null;

  const handleSubmit = (val: string) => {
    handleSort(val, '');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetOrderObject();
    setIsOpen(false);
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.order-component')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative order-component">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full max-w-28 overflow-hidden flex items-center justify-between gap-2 h-8 px-3 py-2 text-sm rounded-md border bg-transparent shadow-xs transition-colors sm:max-w-36 md:text-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary ${
          selectedParameter ? 'border-primary' : 'border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          {selectedParameter ? (
            <>
              <span className="text-left flex-1">{selectedParameter[0]}</span>
              <button
                onClick={handleClear}
                className="p-0.5 hover:bg-gray-200 rounded"
                aria-label="Clear value"
              >
                <X className="size-3" />
              </button>
            </>
          ) : (
            <span className="text-muted-foreground">Ordenar</span>
          )}
        </div>
        <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-1">
            {orderParameters.map(([key, val]) => {
              const isSelected = selectedParameter?.[1] === val;
              return (
                <li key={val}>
                  <button
                    type="button"
                    onClick={() => handleSubmit(val)}
                    className={`w-full flex items-center justify-between px-3 py-2 md:text-base hover:bg-gray-100 transition-colors ${
                      isSelected ? 'bg-gray-50' : ''
                    }`}
                  >
                    <span>{key}</span>
                    {isSelected && sortObject && (
                      <div className="flex items-center gap-1">
                        <ArrowUp
                          className={`size-3 ${
                            sortObject.direction === 'asc' ? 'text-primary' : 'text-gray-400'
                          }`}
                        />
                        <ArrowDown
                          className={`size-3 ${
                            sortObject.direction === 'desc' ? 'text-primary' : 'text-gray-400'
                          }`}
                        />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}


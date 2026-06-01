"use client";

import { orderContext } from "@/contexts";
import { compareValues } from "@/utils/compareValues";
import { ProductType } from "@/types";

export interface SortConfig {
  [key: string]: {
    type: 'number' | 'date' | 'string';
    default?: boolean;
  };
}

export const useOrderContext = (scope?: string) => {
  const {
    sortObject,
    setSortObject,
    resetOrderObject
  } = orderContext();
  const scopedSortObject =
    scope
      ? sortObject?.scope === scope ? sortObject : null
      : sortObject?.scope ? null : sortObject;

  // Aplicar ordenamiento
  const orderProducts = (products: ProductType[] | null): ProductType[] | null => {
    if (!products) return null;

    if (scopedSortObject) {
      return [...products].sort((a, b) => {
        const aValue = a[scopedSortObject.property as keyof ProductType];
        const bValue = b[scopedSortObject.property as keyof ProductType];
        const comparison = compareValues(aValue, bValue, 'number');
        return scopedSortObject.direction === 'asc' ? comparison : -comparison;
      });
    }

    return products;
  };

  // Aplicar ordenamiento a items de Admins
  const orderItems = <T extends Record<string, unknown>>(
    items: T[] | null,
    sortConfig: SortConfig
  ): T[] | null => {
    if (!items) return null;

    if (scopedSortObject && sortConfig[scopedSortObject.property]) {
      return [...items].sort((a, b) => {
        const aValue = a[scopedSortObject.property];
        const bValue = b[scopedSortObject.property];
        const comparison = compareValues(
          aValue,
          bValue,
          sortConfig[scopedSortObject.property].type
        );
        return scopedSortObject.direction === 'asc' ? comparison : -comparison;
      });
    }

    return items;
  };

  // Manejar ordenamiento
  function handleSort(property: string, direction: '' | 'asc' | 'desc' = '') {
    if (!property && direction === '') {
      resetOrderObject();
    } else if (direction !== '') {
      setSortObject({ property, direction, scope });
    } else if (scopedSortObject?.property === property) {
      setSortObject({
        property: scopedSortObject.property,
        direction: scopedSortObject.direction === 'asc' ? 'desc' : 'asc',
        scope,
      });
    } else {
      setSortObject({ property, direction: 'asc', scope });
    }
  }

  return {
    orderProducts,
    orderItems,
    sortObject: scopedSortObject,
    handleSort,
    resetOrderObject
  };
};


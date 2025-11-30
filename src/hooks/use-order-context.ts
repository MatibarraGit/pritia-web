import { orderContext } from "@/contexts";
import { compareValues } from "@/utils/compareValues";
import { ProductType } from "@/types";

export interface SortConfig {
  [key: string]: {
    type: 'number' | 'date' | 'string';
    enabled?: boolean;
    default?: boolean;
  };
}

export const useOrderContext = () => {
  const {
    sortObject,
    setSortObject,
    resetOrderObject
  } = orderContext();

  // Aplicar ordenamiento
  const orderProducts = (products: ProductType[] | null): ProductType[] | null => {
    if (!products) return null;

    if (sortObject) {
      return [...products].sort((a, b) => {
        const aValue = a[sortObject.property as keyof ProductType];
        const bValue = b[sortObject.property as keyof ProductType];
        const comparison = compareValues(aValue, bValue, 'number');
        return sortObject.direction === 'asc' ? comparison : -comparison;
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

    if (sortObject && sortConfig[sortObject.property]) {
      return [...items].sort((a, b) => {
        const aValue = a[sortObject.property];
        const bValue = b[sortObject.property];
        const comparison = compareValues(
          aValue,
          bValue,
          sortConfig[sortObject.property].type
        );
        return sortObject.direction === 'asc' ? comparison : -comparison;
      });
    }

    return items;
  };

  // Manejar ordenamiento
  function handleSort(property: string, direction: '' | 'asc' | 'desc' = '') {
    if (!property && direction === '') {
      resetOrderObject();
    } else if (direction !== '') {
      setSortObject({ property, direction });
    } else if (sortObject?.property === property) {
      setSortObject({
        property: sortObject.property,
        direction: sortObject.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortObject({ property, direction: 'asc' });
    }
  }

  return {
    orderProducts,
    orderItems,
    sortObject,
    handleSort,
    resetOrderObject
  };
};


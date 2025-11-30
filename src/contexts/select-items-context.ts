import { create } from "zustand";

interface SelectItemsState {
  isSelecting: boolean;
  selectedItems: number[];
  toggleSelecting: (value?: boolean) => void;
  toggleItemSelection: (id: number) => void;
  toggleAllItemsSelection: (itemsIds: number[]) => void;
  deleteSelectedItems: (removeFunction: (id: number) => void, isSelecting?: boolean) => void;
}

export const selectItemsContext = create<SelectItemsState>((set, get) => ({
  // Estados
  isSelecting: false,
  selectedItems: [],

  // Funciones para setear estados
  toggleSelecting: (value?: boolean) => {
    const { isSelecting } = get();

    if (value !== undefined) {
      set({ isSelecting: value });
      return;
    }

    if (isSelecting === true) {
      set({ isSelecting: false, selectedItems: [] });
    } else {
      set({ isSelecting: true });
    }
  },

  toggleItemSelection: (id: number) => {
    set((state) => {
      const { selectedItems } = state;

      const newSelectedItems = selectedItems.includes(id)
        ? selectedItems.filter((itemId) => itemId !== id)
        : [...selectedItems, id];

      return { selectedItems: newSelectedItems };
    });
  },

  toggleAllItemsSelection: (itemsIds: number[]) => {
    set((state) => {
      const { selectedItems } = state;

      if (selectedItems.length === itemsIds.length) {
        return { selectedItems: [] };
      } else {
        return { selectedItems: [...itemsIds] };
      }
    });
  },

  deleteSelectedItems: (removeFunction: (id: number) => void, isSelecting = false) => {
    const { selectedItems } = get();

    // Ejecutar la función de eliminación para cada item seleccionado
    selectedItems.forEach((itemId) => {
      removeFunction(itemId);
    });

    // Limpiar la selección
    set({ selectedItems: [], isSelecting });
  },
}));


import { create } from "zustand";
import { SelectedItemsType } from "@/types";

interface SelectItemsState {
  isSelecting: boolean;
  selectedItems: SelectedItemsType[];
  selectedIds: number[];
  toggleSelecting: (value?: boolean) => void;
  toggleItemSelection: (item: SelectedItemsType) => void;
  toggleAllItemsSelection: (items: SelectedItemsType[]) => void;
  deleteItemToSelection: (item: SelectedItemsType) => void;
  deleteSelectedItems: (
    removeFunction: (id: number) => void,
    isSelecting?: boolean
  ) => void;
}

export const selectItemsContext = create<SelectItemsState>((set, get) => ({
  // Estados
  isSelecting: false,
  selectedItems: [],
  selectedIds: [],

  // Funciones para setear estados
  toggleSelecting: (value?: boolean) => {
    const { isSelecting } = get();

    if (value === true) {
      set({ isSelecting: true });
      return;
    } else if (value === false) {
      set({ isSelecting: false, selectedItems: [], selectedIds: [] });
      return;
    }

    if (isSelecting === true) {
      set({ isSelecting: false, selectedItems: [], selectedIds: [] });
    } else {
      set({ isSelecting: true });
    }
  },

  toggleItemSelection: (item: SelectedItemsType) => {
    set((state) => {
      const { selectedItems, selectedIds } = state;

      const newSelectedItems = selectedIds.includes(item.id)
        ? selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
        : [...selectedItems, item];

      return { selectedItems: newSelectedItems, selectedIds: newSelectedItems.map(item => item.id) };
    });
  },

  toggleAllItemsSelection: (items: SelectedItemsType[]) => {
    set((state) => {
      const { selectedItems } = state;

      if (selectedItems.length === items.length) {
        return { selectedItems: [], selectedIds: [] };
      } else {
        return { selectedItems: [...items], selectedIds: items.map(item => item.id) };
      }
    });
  },

  deleteItemToSelection: (item: SelectedItemsType) => {
    set((state) => {
      const { selectedItems } = state;

      const newSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem.id !== item.id
      );

      return { selectedItems: newSelectedItems, selectedIds: newSelectedItems.map(item => item.id) };
    });
  },

  deleteSelectedItems: (
    removeFunction: (id: number) => void,
    isSelecting = false
  ) => {
    const { selectedItems } = get();

    // Ejecutar la función de eliminación para cada item seleccionado
    selectedItems.forEach((item) => {
      removeFunction(item.id);
    });

    // Limpiar la selección
    set({ selectedItems: [], isSelecting });
  },
}));

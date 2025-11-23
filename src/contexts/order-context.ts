import { create } from 'zustand';

export interface SortObject {
  property: string;
  direction: 'asc' | 'desc';
}

interface OrderState {
  sortObject: SortObject | null;
  setSortObject: (sortObject: SortObject) => void;
  resetOrderObject: () => void;
}

export const orderContext = create<OrderState>((set) => ({
  // Estados
  sortObject: null,

  // Función para setear el parámetro de orden
  setSortObject: (sortObject: SortObject) => set(() => ({
    sortObject
  })),

  // Funcion para resetear los parámetros de orden
  resetOrderObject: () => set({ sortObject: null })
}));


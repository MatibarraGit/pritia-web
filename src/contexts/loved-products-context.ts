import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProductType } from "@/types";

export type LovedProductType = ProductType & {
  dateAdded?: string;
};

interface LovedProductsState {
  lovedProducts: LovedProductType[];
  productIsLoved: (id: number) => boolean;
  addLovedProduct: (product: ProductType) => void;
  removeLovedProduct: (id: number) => void;
}

export const lovedProductsContext = create<LovedProductsState>()(persist((set, get) => ({
  lovedProducts: [],

  productIsLoved: (id: number) => {
    return get().lovedProducts.some(
      (lovedProduct) => lovedProduct.id === id
    );
  },

  addLovedProduct: (product: ProductType) => {
    const existingProduct = get().lovedProducts.find(
      (p) => p.id === product.id
    );
    if (!existingProduct) {
      set({
        lovedProducts: [
          ...get().lovedProducts,
          { ...product, dateAdded: new Date().toISOString() },
        ],
      });
    }
  },

  removeLovedProduct: (id: number) => {
    set({
      lovedProducts: get().lovedProducts.filter(
        (lovedProduct) => lovedProduct.id !== id
      ),
    });
  },
}), 
  {
    name: 'lovedProducts-storage',
    storage: createJSONStorage(() => localStorage)
  }
));

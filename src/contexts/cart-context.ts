import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItemType } from "@/types"

interface CartState {
  items: CartItemType[]
  productInCart: (data: CartItemType) => { existingItem: CartItemType | undefined }
  addToCart: (data: CartItemType) => void
  increaseProductQuantity: (id: number) => void
  decreaseProductQuantity: (id: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
}

export const cartContext = create<CartState>()(persist((set, get) => ({
  items: [],

  // Producto en el carrito?
  productInCart: (data: CartItemType) => {
    const currentItems = get().items
    const existingItem = currentItems.find((item) => item.id === data.id)

    return { existingItem }
  },

  // Añadir al carrito
  addToCart: (data: CartItemType) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === data.id)

      // Sumar 1 si ya existe en el carrito
      if (existingItem) {
        // Evitar sumar más cantidad que el stock disponible
        const newQuantity = existingItem.quantity + (data.quantity ?? 1)
        if (newQuantity >= 100) return state

        return {
          items: state.items.map((item) =>
            item.id === data.id ? { ...item, quantity: newQuantity } : item
          ),
        }
      }

      // Si el producto no existe en el carrito, aseguramos que tenga una cantidad válida
      return {
        items: [...state.items, { ...data, quantity: data.quantity ?? 1 }],
      }
    })
  },

  // Sumar 1
  increaseProductQuantity: (id: number) => {
    const currentItems = get().items
    const updatedItems = currentItems.map((item) => {
      if (item.id === id && item.quantity < 100) {
        return { ...item, quantity: item.quantity + 1 }
      } else {
        return item
      }
    })

    set({
      items: updatedItems,
    })
  },

  // Restar 1
  decreaseProductQuantity: (id: number) => {
    const currentItems = get().items
    const updatedItems = currentItems.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 }
      } else {
        return item
      }
    })

    set({
      items: updatedItems,
    })
  },

  // Eliminar del carrito
  removeFromCart: (id: number) => {
    set({
      items: [...get().items.filter((item) => item.id !== id)],
    })
  },

  clearCart: () => {
    set({
      items: [],
    })
  }, 
}), {
  name: 'cart-storage',
  storage: createJSONStorage(() => localStorage),
}))
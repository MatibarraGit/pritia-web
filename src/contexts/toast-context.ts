import { create } from "zustand";

type ToastState = {
  toastOpened: boolean;
  toastMessage: string;
  toastType: string;
  timeoutId: NodeJS.Timeout | undefined;
  isCartOpen: boolean;
  showToast: (message: string, type: string) => void;
  closeToast: () => void;
  toggleCart: () => void;
  closeCart: () => void;
}

export const toastContext = create<ToastState>((set, get) => ({
  // Estado del toast
  toastOpened: false,
  toastMessage: '',
  toastType: '',
  timeoutId: undefined,

  // Estado del carrito
  isCartOpen: false,

  // Abrir toast e iniciar temporizador
  showToast: (message: string, type: string) => {
    const { timeoutId, toastOpened }: ToastState = get()

    // Si hay un toast abierto, lo cerramos, limpiamos el temporizador y establecemos el nuevo toast
    if (toastOpened) { 
      set({ toastOpened: false })
      clearTimeout(timeoutId)
      setTimeout(() => {
      set({ toastOpened: true, toastMessage: message, toastType: type });
      }, 100)
    } else { // Si no hay un toast abierto, establecemos el nuevo toast
      set({ toastOpened: true, toastMessage: message, toastType: type });
    }

    // Iniciamos un nuevo temporizador
    const newTimeoutId = setTimeout(() => {
      set({ toastOpened: false })
    }, 3000)

    // Guardamos el ID del nuevo temporizador
    set({ timeoutId: newTimeoutId })
  },

  // Cerrar toast y limpiar el temporizador
  closeToast: () => {
    const { timeoutId } = get() 
    if (timeoutId) {
      clearTimeout(timeoutId)
    } 
    set({ toastOpened: false });
  },

  toggleCart: () => {
    set((state) => {
      const newState = !state.isCartOpen
      if (newState) {
        document.body.classList.add("overflow-hidden")
      } else {
        document.body.classList.remove("overflow-hidden")
      }
      return { isCartOpen: newState }
    })
  },

  // Cerrar el carrito
  closeCart: () => {
    set({ isCartOpen: false })
    document.body.classList.remove("overflow-hidden")
  }
}))
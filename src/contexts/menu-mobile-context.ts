import { create } from "zustand";

interface MenuMobileState {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

export const menuMobileContext = create<MenuMobileState>((set) => ({
  isOpen: false,
  openMenu: () => {
    set({ isOpen: true });
    document.body.classList.add("overflow-hidden");
  },
  closeMenu: () => {
    set({ isOpen: false });
    document.body.classList.remove("overflow-hidden");
  },
  toggleMenu: () => {
    set((state) => {
      const newState = !state.isOpen;
      if (newState) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
      return { isOpen: newState };
    });
  },
}));


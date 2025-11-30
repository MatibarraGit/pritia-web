import { create } from 'zustand';

interface AdminSidebarState {
  sidebar: boolean; // Para mobile
  sidebarDesktop: boolean; // Para desktop
  toggleSidebar: (value: boolean) => void;
  toggleSidebarDesktop: () => void;
}

export const adminSidebarContext = create<AdminSidebarState>((set) => ({
  sidebar: false,
  sidebarDesktop: true, // Por defecto visible en desktop
  toggleSidebar: (value: boolean) => {
    set({ sidebar: value });
    if (value === true) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }
  },
  toggleSidebarDesktop: () => {
    set((state) => ({ sidebarDesktop: !state.sidebarDesktop }));
  }
}));
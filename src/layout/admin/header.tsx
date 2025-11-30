"use client";

import { Menu, X } from "lucide-react";
import { cn } from "@/libs/utils";
import { adminSidebarContext } from "@/contexts";

export const AdminHeader = () => {
  const { sidebarDesktop: sidebarVisible, toggleSidebar, toggleSidebarDesktop: toggleSidebarVisible } = adminSidebarContext();

  return (
    <header className={cn(
      "h-[70px] px-4 m-0 flex items-center fixed top-0 z-10 bg-white border-b border-gray-200 shadow-sm transition-all duration-300",
      "w-full",
      sidebarVisible ? "md:w-[calc(100%-16rem)] md:ml-64" : "md:w-full md:ml-0"
    )}>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => toggleSidebar(true)} 
          className="flex items-center justify-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>

        <button
          onClick={toggleSidebarVisible}
          className="hidden md:flex items-center justify-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
          aria-label={sidebarVisible ? "Ocultar menú" : "Mostrar menú"}
        >
          {sidebarVisible ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
        </button>
      </div>


      <h2 className="mx-auto text-xl font-bold text-primary hidden md:flex md:items-center">Mi Proyecto</h2>
    </header>
  );
};

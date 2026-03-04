"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/libs/utils";

import { adminSidebarContext } from "@/contexts";
import { AdminSidebarLink } from "@/components";
import { X } from "lucide-react";

export const AdminSidebar = () => {
  const { sidebar, sidebarDesktop, toggleSidebar } = adminSidebarContext();
  const path = usePathname();
  const prevPathRef = useRef(path);

  const handleLinkClick = () => {
    toggleSidebar(false);
  };
  
  // Cerrar sidebar mobile cuando cambia la ruta
  useEffect(() => {
    if (prevPathRef.current !== path) {
      prevPathRef.current = path;
      toggleSidebar(false);
    }
  }, [path, toggleSidebar]);

  return (
    <>
      {sidebar && 
        <div 
          className="fixed inset-0 z-9 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300 md:hidden"
          onClick={() => toggleSidebar(false)}
        />
      }
      <aside className={cn(
        "h-screen fixed top-0 z-10 bg-white border-r border-gray-200 shadow-xl transition-all duration-300 ease-in-out",
        // Mobile
        "w-5/6 max-w-75",
        sidebar ? "left-0" : "-left-full",
        // Desktop
        "md:w-64 md:shadow-none",
        sidebarDesktop ? "md:left-0 md:opacity-100" : "md:-left-64 md:opacity-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-[70px] px-4 border-b border-gray-200 bg-white">
          <h1 className="text-lg font-bold text-primary">Admin Panel</h1>

          <button 
            onClick={() => toggleSidebar(false)} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95 md:hidden"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="w-full min-h-content overflow-y-auto">
          <div className="p-4">
            <span
              className="text-xs font-semibold text-gray-400 uppercase tracking-wider p-2"
            >
              Menú Principal
            </span>
   
            {/* Sección de Menú Principal */}
            <div className="mb-6">
              <div className="flex flex-col gap-1">
                <AdminSidebarLink 
                  to={"/admin"} 
                  onClick={handleLinkClick} 
                  src={"/icons/dashboard.svg"} 
                  alt='productos' 
                  size={24} 
                  span={'Dashboard'}
                />
              </div>
            </div>

            {/* Sección Logística */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-3 px-2">Logística</h2>
              <div className="flex flex-col gap-1">
                <AdminSidebarLink 
                  to={"/admin/products"} 
                  onClick={handleLinkClick} 
                  src={"/icons/product.svg"} 
                  alt='productos' 
                  size={20} 
                  span={'Productos'}
                />

                {/* <AdminSidebarLink 
                  to={"/admin/categories"} 
                  onClick={handleLinkClick} 
                  src={"/icons/categories.svg"} 
                  alt='categorías' 
                  size={20} 
                  span={'Categorías'}
                />

                <AdminSidebarLink 
                  to={"/admin/purchase-orders"} 
                  onClick={handleLinkClick} 
                  src={"/icons/purchase-order.svg"} 
                  alt='Órdenes de compra' 
                  size={20} 
                  span={'Órdenes de compra'}
                /> */}
              </div>
            </div>

            {/* Sección Control */}
            {/* <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-3 px-2">Control</h2>
              <div className="flex flex-col gap-1">
                <AdminSidebarLink 
                  to={"/admin/admins"} 
                  onClick={handleLinkClick} 
                  src={"/icons/admin.svg"} 
                  alt='Administradores' 
                  size={20} 
                  span={'Administradores'}
                />

                <AdminSidebarLink 
                  to={"/admin/providers"} 
                  onClick={handleLinkClick} 
                  src={"/icons/provider.svg"} 
                  alt='Proveedores' 
                  size={20} 
                  span={'Proveedores'}
                />
              </div>
            </div> */}
          </div>

          {/* Volver a la tienda */}
          <div className="absolute bottom-6 left-0 right-0 px-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-8 p-2 hover:text-primary hover:bg-gray-100 rounded-lg transition-all duration-200 md:mb-4">
              <img src="/logo.png" alt="Volver a la tienda" width={32} height={32} />
              <span>Volver a la tienda</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
};

"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { menuMobileContext } from "@/contexts";
import { CategoriesAccordion } from "./CategoriesAccordion";
import { FacebookButton, InstagramButton, WhatsappButton } from "@/components";
import { cn } from "@/libs/utils";

export const MenuMobile = () => {
  const { isOpen, closeMenu } = menuMobileContext();

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Cerrar menú"
        onClick={closeMenu}
      />

      {/* Menu Sidebar */}
      <aside className={cn(
        "h-full fixed top-0 bg-white shadow-xl z-50 md:hidden overflow-y-auto sidebar-transition",
        "w-4/5 max-w-80",
        isOpen ? "left-0" : "-left-full"
      )}>
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">

          {/* Header */}
          <h3 className="text-lg font-semibold text-gray-900">
            Bienvenidos a Mi Proyecto!
          </h3>

          <button
            type="button"
            onClick={closeMenu}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="px-4 py-1">

          {/* Navigation */}
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/"
                className="block py-3 px-1 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="block py-3 px-1 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMenu}
              >
                Todos los productos
              </Link>
            </li>
            <li>
              <CategoriesAccordion isMenuMobile={true} />
            </li>

            {/* Social Icons */}
            <li className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 justify-center">
                <WhatsappButton size="8"/>
                <FacebookButton size="8" />
                <InstagramButton size="8" />
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
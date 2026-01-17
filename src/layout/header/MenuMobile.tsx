"use client";

import Link from "next/link";
import { Heart, HelpCircle, ShoppingBag, Store, X } from "lucide-react";
import { Suspense } from "react";

import { menuMobileContext } from "@/contexts";
import { CategoriesAccordion } from "./CategoriesAccordion";
import { FacebookButton, InstagramButton, MailButton, WhatsappButton } from "@/components";
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
            Bienvenido a Pritia!
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
                className="py-3 px-1 flex items-center gap-2 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMenu}
              >
                <Store size={24} />
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="py-3 px-1 flex items-center gap-2 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMenu}
              >
                <ShoppingBag size={24} />
                Todos los productos
              </Link>
            </li>
            <li>
              <Suspense fallback={
                <div className="w-full p-4 text-center text-sm text-gray-500">
                  Cargando categorías...
                </div>
              }>
                <CategoriesAccordion isMenuMobile={true} />
              </Suspense>
            </li>
            <li>
              <Link
                href="/loved-products"
                className="py-3 px-1 flex items-center gap-2 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMenu}
              >
                <Heart size={24} />
                Favoritos
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className="py-3 px-1 flex items-center gap-2 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMenu}
              >
                <HelpCircle size={24} />
                Ayuda
              </Link>
            </li>

            {/* Social Icons */}
            <li className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 justify-center">
                <WhatsappButton size="8"/>
                <MailButton size="8"/>
                {/* <FacebookButton size="8" />
                <InstagramButton size="8" /> */}
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
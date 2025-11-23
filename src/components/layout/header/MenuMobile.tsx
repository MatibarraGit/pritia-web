// TODO: Agregar el logo y el nombre del negocio
// TODO: Agregar los íconos de las redes sociales
// TODO: Agregar los enlaces del NavigationMenu

"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

import { CategoriesAccordion } from "./CategoriesAccordion";

export const MenuMobile = () => {
  return (
    <>
      {/* Overlay */}
      <label
        htmlFor="header__open-menu"
        className="hidden peer-checked:block fixed inset-0 bg-black/50 z-40 md:hidden"
        aria-label="Cerrar menú"
      />

      {/* Menu Sidebar */}
      <aside className="hidden peer-checked:block fixed right-0 top-0 h-full w-[80%] max-w-[320px] bg-white shadow-xl z-50 md:hidden overflow-y-auto">
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-end z-10">
          <label
            htmlFor="header__open-menu"
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </label>
        </div>

        {/* Menu Content */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Bienvenidos a MD Directo!
            </h3>
          </div>

          {/* Navigation */}
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/"
                className="block py-3 px-2 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => {
                  const checkbox = document.getElementById("header__open-menu") as HTMLInputElement;
                  if (checkbox) checkbox.checked = false;
                  document.body.classList.remove("overflow-hidden");
                }}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="block py-3 px-2 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => {
                  const checkbox = document.getElementById("header__open-menu") as HTMLInputElement;
                  if (checkbox) checkbox.checked = false;
                  document.body.classList.remove("overflow-hidden");
                }}
              >
                Todos los productos
              </Link>
            </li>
            <li>
              <CategoriesAccordion />
            </li>

            {/* Social Icons */}
            <li className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 justify-center">
                <a
                  href="https://wa.me/+5491140226227"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="WhatsApp"
                >
                  <Image
                    src="/icons/whatsapp.svg"
                    alt="WhatsApp"
                    width={25}
                    height={25}
                  />
                </a>

                <a
                  href="https://web.facebook.com/md.directo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <Image
                    src="/icons/facebook.svg"
                    alt="Facebook"
                    width={25}
                    height={25}
                  />
                </a>

                <a
                  href="https://www.instagram.com/mddirectoarg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Instagram"
                >
                  <Image
                    src="/icons/instagram.svg"
                    alt="Instagram"
                    width={25}
                    height={25}
                  />
                </a>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};


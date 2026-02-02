"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import { CartSidebar } from "@/components"; 
import { CartButton, CheckboxMenu, FavouritesMenu, MenuMobile, SearchComponent } from "@/layout"

export const Header = () => {
  return (
    <>
      <CheckboxMenu />
      <header className="w-full max-w-screen h-16 mt-10 sticky top-0 left-0 z-40 bg-background">
      {/* <header className="w-full max-w-screen h-16 fixed top-0 left-0 z-40 bg-background"> */}
        <div className="w-11/12 max-w-content h-full mx-auto flex items-center justify-between gap-12 relative">
          {/* Mobile menu button */}
          <label
            htmlFor="header__open-menu"
            className="md:hidden p-2 flex items-center relative right-2 cursor-pointer hover:bg-black/5 rounded-full"
          >
            <Menu className="size-6 text-black" />
          </label>

          {/* Brand */}
          <Link href="/" className="flex items-center shrink-0 text-2xl md:text-3xl font-heading text-primary w-16 h-16">
            <Image src="/logo2.png" alt="Lubri" width={400} height={500} />
          </Link>

          {/* Search Bar */}
          <SearchComponent />

          {/* Cart */}
          <div className="flex items-center gap-2">
            <FavouritesMenu />
            <CartButton />
            
            <CartSidebar />
          </div>
        </div>
      </header>
      <MenuMobile />
    </>
  );
};

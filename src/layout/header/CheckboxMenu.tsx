"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { menuMobileContext } from "@/contexts";

export const CheckboxMenu = () => {
  const pathname = usePathname();
  const { isOpen, closeMenu, toggleMenu } = menuMobileContext();

  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <input
      type="checkbox"
      id="header__open-menu"
      className="hidden peer"
      checked={isOpen}
      onChange={toggleMenu}
    />
  );
};


// TODO: Solucionar el warning de setState dentro de un effect
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export const CheckboxMenu = () => {
  const pathname = usePathname();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(false);
    document.body.classList.remove("overflow-hidden");
  }, [pathname]);

  const onChange = () => {
    setIsChecked(!isChecked);
    document.body.classList.toggle("overflow-hidden");
  };

  return (
    <input
      type="checkbox"
      id="header__open-menu"
      className="hidden peer"
      checked={isChecked}
      onChange={onChange}
    />
  );
};


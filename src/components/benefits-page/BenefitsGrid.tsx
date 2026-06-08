"use client";

import { useEffect, useState } from "react";
import BenefitCell from "./BenefitCell";

// Datos de ejemplo - esto lo conectarás con tu backend
const mockPurchases: Record<number, string> = {
  1: "Claudia",
  2: "Nazareno",
  3: "Matías",
  4: "Reina",
  5: "Matías",
  6: "Claudia",
  7: "Claudia",
  8: "Claudia",
  9: "Reina",
  10: "Reina",
  11: "Martín",
};

const BenefitsGrid = () => {
  const [openNumber, setOpenNumber] = useState(0);
  const cells = Array.from({ length: 50 }, (_, i) => i + 1);

  // Efecto para cerrar el tooltip cuando se hace click fuera de la celda
  useEffect(() => {
    const handleOutsideCellClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const isBenefitCellClick = !!target?.closest("[data-benefit-cell='true']");

      if (!isBenefitCellClick) setOpenNumber(0);
    };

    document.addEventListener("click", handleOutsideCellClick);
    return () => {
      document.removeEventListener("click", handleOutsideCellClick);
    };
  }, []);

  return (
    <div 
      className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 w-full max-w-4xl mx-auto"
    >
      {cells.map((number) => (
        <BenefitCell
          key={number}
          number={number}
          buyerName={mockPurchases[number]}
          isPurchased={!!mockPurchases[number]}
          openNumber={openNumber}
          setOpenNumber={setOpenNumber}
        />
      ))}
    </div>
  );
};

export default BenefitsGrid;
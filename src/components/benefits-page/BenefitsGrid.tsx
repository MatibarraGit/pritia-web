"use client";

import { useState } from "react";
import BenefitCell from "./BenefitCell";

// Datos de ejemplo - esto lo conectarás con tu backend
const mockPurchases: Record<number, string> = {
  1: "Claudia",
  2: "Nazareno",
};

const BenefitsGrid = () => {
  const [openNumber, setOpenNumber] = useState(0);
  const cells = Array.from({ length: 50 }, (_, i) => i + 1);

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
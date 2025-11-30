import { Truck, CreditCard } from "lucide-react";

export function ProductShippingInfo() {
  return (
    <div className="flex flex-col gap-4 pt-4 md:flex-row">
      <div className="flex items-center space-x-2 text-sm">
        <Truck className="h-5 w-5 text-primary" />
        <span>Envío todo el país</span>
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <CreditCard className="h-5 w-5 text-primary" />
        <span>Aceptamos tarjetas de crédito</span>
      </div>
    </div>
  );
}

